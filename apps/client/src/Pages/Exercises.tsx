import { useEffect, useState } from "react";
import { DEFAULT_LESSON_ID } from "../defaultLesson";

/*
1. Should I highlight in UI if a definition has already been selected (Probably!)
2. Navigation bar
3. Delete log in page?? Mock log-in if time
5. Make exercises page more readable!
7. Style the page!
8. Add another page with Sudoku??
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
  const [attemptCount, setAttemptCount] = useState(0);
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
    async function loadPreviousAttempt() {
      const res = await fetch(`/api/lessons/${lessonId}/attempts/last`); //not found
      const data = await res.json();

      console.log(data, "logging data previous attempt"); //logs 3

      if (data.answers) {
        setAnswers(data.answers);
        setAttemptCount(data.attemptCount);
      }
      if (data.correct === true) {
        setMessage("You already passed this exercise!");
      }
    }
    loadPreviousAttempt();
  }, [lessonId]);

  console.log(answers); //empty object

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

  useEffect(() => {
    async function loadAttemptCount() {
      const res = await fetch(
        `http://localhost:8080/api/lessons/${lessonId}/attempts/count`
      );
      const data = await res.json();
      // console.log(data);
      // console.log(data.lessonId);
      // console.log(data.answers);
      setAttemptCount(data.attemptCount); // Overwrite React state with DB value
    }

    loadAttemptCount();
  }, [lessonId]); //message - saying hook has a missing dependency...

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition">
        <em>Select lesson</em>
      </button>
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
          <strong>{word.term}</strong>

          <select
            value={answers[word.id] || ""}
            onChange={(e) => handleSelect(word, e.target.value)}
            disabled={attemptCount >= maxAttempts || hasPassed}
          >
            <option value={""}>-- choose definition --</option>

            {definitions.map((def) => (
              <option key={def} value={def}>
                {def}
              </option>
            ))}
          </select>

          {correct[word.id] !== undefined && (
            <p className="mt-2 text-sm font-medium">
              {correct[word.id] ? "text-green-600" : "text-red-600"}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={
          attemptCount >= maxAttempts ||
          words.length === 0 ||
          message.length > 0
        }
        className="rounded-md bg-green-400 hover: bg-green-700 text-white py02 opacity-50 px-4"
      >
        Submit answers
      </button>
    </div>
  );
}
