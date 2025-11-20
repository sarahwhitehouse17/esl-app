import { useEffect, useState } from "react";
import { DEFAULT_LESSON_ID } from "../defaultLesson";

/*
1. Should I highlight in UI if a definition has already been selected (Probably!)
2. Delete log in page?? Mock log-in if time
3. Make exercises page more readable!
4. Add another page with Sudoku??
5. Move some parts of exercises page somewhere else?
*/

type Word = {
  id: number;
  term: string;
  definition: string;
  lessonId: number;
};

export default function MatchingExercise() {
  const [words, setWords] = useState<Word[]>([]);
  const [definitions, setDefinitions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [correct, setCorrect] = useState<{ [id: number]: boolean }>({});
  const [attemptCount, setAttemptCount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const hasPassed = Boolean(message);
  const lessonId = DEFAULT_LESSON_ID; //checked and lessonId definitely working

  const maxAttempts = 3;

  useEffect(() => {
    async function loadWords() {
      const res = await fetch(`/api/lessons/${lessonId}/words`); //hardcoded lesson for now
      const data: Word[] = await res.json();
      setWords(data);

      // Create a shuffled list of definitions once
      const defs = [...data]
        .map((w) => w.definition)
        .sort(() => Math.random() - 0.5);
      setDefinitions(defs);
    }

    loadWords();
  }, [lessonId]);

  useEffect(() => {
    async function loadInitialData() {
      const [lastRes, countRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}/attempts/last`),
        fetch(`/api/lessons/${lessonId}/attempts/count`),
      ]);

      const lastData = await lastRes.json();
      const countData = await countRes.json();

      console.log("Last attempt:", lastData);
      console.log("Count:", countData);

      setAttemptCount(countData.attemptCount);

      // Restore previous answers (if any)
      if (lastData.answers) {
        setAnswers(lastData.answers);
      }

      // If it was already passed
      if (lastData.correct === true) {
        setMessage("You already passed this exercise!");
      }
    }

    loadInitialData();
  }, [lessonId]);

  useEffect(() => {
    async function loadPassed() {
      const res = await fetch(`/api/lessons/${lessonId}/attempts/passed`);
      const data = await res.json();

      if (data.passed === true) {
        setMessage(`Congratulations - you've passed all the exercises!`);
      }
    }
    loadPassed();
  }, [lessonId]);

  function handleSelect(word: Word, selectedDefinition: string) {
    if (attemptCount >= maxAttempts) return;

    setAnswers((prev) => ({
      ...prev,
      [word.id]: selectedDefinition,
    }));
  }

  async function handleSubmit() {
    if (attemptCount >= maxAttempts) return;
    if (words.length === 0) return;

    // Build correctness map
    const correctnessMap: { [id: number]: boolean } = {};
    words.forEach((word) => {
      const chosen = answers[word.id];
      const isCorrect = chosen === word.definition;
      correctnessMap[word.id] = isCorrect;
    });

    setCorrect(correctnessMap);

    const nextAttemptNum = attemptCount + 1;
    setAttemptCount(nextAttemptNum);

    // Save summary attempt to backend
    await saveAttemptToBackend(correctnessMap, nextAttemptNum);
    // console.log(correctnessMap, nextAttemptNum);
  }

  async function saveAttemptToBackend(
    results: { [id: number]: boolean },
    attemptNum: number
  ) {
    if (words.length === 0) return;

    const allCorrect = Object.values(results).every(Boolean);

    if (allCorrect) {
      setMessage("Congratulations - you've passed all the exercises!");
    }

    await fetch(`/api/lessons/${lessonId}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correct: allCorrect,
        attemptNum,
        answers,
      }),
    });
  }

  if (attemptCount === null) {
    return (
      <div>
        <p className="text-center p-6">Loading exercise...</p>
      </div>
    );
  }

  const requiredIds = words.map((word) => word.id);
  const allAnswered = requiredIds.every((id) => answers[id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Match the words to their definitions
      </h2>

      <p className="text-sm text-center italic mb-4">
        Attempts used: {attemptCount} / {maxAttempts}
      </p>

      {attemptCount >= maxAttempts && !hasPassed && (
        <div>
          <p className="text-red-600 text-center font-medium">
            You are out of attempts for this exercise.
          </p>
        </div>
      )}
      {hasPassed && (
        <div>
          <p className="text-green-600 text-center font-medium">{message}</p>
        </div>
      )}

      {words.map((word) => (
        <div key={word.id} className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm">
          <strong className="pr-3">{word.term}</strong>
          <div className="relative">
            <select
              value={answers[word.id] || ""}
              onChange={(e) => handleSelect(word, e.target.value)}
              disabled={attemptCount >= maxAttempts || hasPassed}
              className="appearance-none pr-32"
            >
              <option value={""}>-- choose definition --</option>

              {definitions.map((def) => (
                <option key={def} value={def}>
                  {def}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              ⌄
            </span>
          </div>

          {correct[word.id] !== undefined && (
            <p
              className={`mt-2 text-sm font-medium ${
                correct[word.id] ? "bg-green-300" : "bg-red-300"
              }`}
            >
              {correct[word.id] ? "Correct" : "Incorrect"}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={
          attemptCount >= maxAttempts ||
          words.length === 0 ||
          message.length > 0 ||
          !allAnswered
        }
        className="rounded-md bg-green-700 text-white py02 opacity-50 px-4"
      >
        {" "}
        Submit
      </button>
      {!allAnswered && (
        <div>
          <p className="text-center mt-4">
            Please select an answer for every word before submitting.
          </p>
        </div>
      )}
    </div>
  );
}
