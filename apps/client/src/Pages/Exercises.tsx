import { useEffect, useState } from "react";
import { DEFAULT_LESSON_ID } from "../defaultLesson";

/*
1. Should I highlight in UI if a definition has already been selected (Probably!)
2. Navigation bar
3. Delete log in page??
5. Make exercises page more readable!
6. Integrate a dictionaryAPI call... this would be more on the teacher side though..currently adding words via Bruno
7. Style the page!
8. Add another page with Sudoku??
9. Using vite config to link with server
10. answers are now on the database, but not persisting in the UI...
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
  const lessonId = DEFAULT_LESSON_ID;

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
      const res = await fetch(`api/lessons/${lessonId}/attempts/last`);
      const data = await res.json();

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
      const res = await fetch(`/api/lessons/${lessonId}/attempts/count`);
      const data = await res.json();
      console.log(data.lessonId);
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
    console.log(correctnessMap, nextAttemptNum);
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
    <div>
      <button>Select lesson</button>
      <h2>Match the words to their definitions</h2>

      <p>
        Attempts used: {attemptCount} / {maxAttempts}
      </p>

      {attemptCount >= maxAttempts && !hasPassed && (
        <div>
          <p style={{ color: "red" }}>
            You are out of attempts for this exercise.
          </p>
        </div>
      )}
      {hasPassed && (
        <div>
          <p style={{ color: "green" }}>{message}</p>
        </div>
      )}

      {words.map((word) => (
        <div key={word.id} style={{ marginBottom: "1.5rem" }}>
          <strong>{word.term}</strong>

          <select
            value={answers[word.id] || ""}
            onChange={(e) => handleSelect(word, e.target.value)}
            disabled={attemptCount >= maxAttempts || hasPassed}
          >
            <option value="">-- choose definition --</option>

            {definitions.map((def) => (
              <option key={def} value={def}>
                {def}
              </option>
            ))}
          </select>

          {correct[word.id] !== undefined && (
            <p
              style={{
                color: correct[word.id] ? "green" : "red",
                marginTop: "0.2rem",
              }}
            >
              {correct[word.id] ? "Correct!" : "Incorrect"}
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
      >
        Submit answers
      </button>
    </div>
  );
}
