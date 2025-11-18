import { useEffect, useState } from "react";

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

  const maxAttempts = 3;

  useEffect(() => {
    async function loadWords() {
      const res = await fetch("/api/lessons/3/words"); //hardcoded lesson for now
      const data: Word[] = await res.json();
      setWords(data);

      // Create a shuffled list of definitions once
      const defs = [...data]
        .map((w) => w.definition)
        .sort(() => Math.random() - 0.5);
      setDefinitions(defs);
    }

    loadWords();
  }, []);

  useEffect(() => {
    async function loadPassed() {
      const res = await fetch("/api/lessons/3/attempts/passed");
      const data = await res.json();

      if (data.passed === true) {
        setMessage(`Congratulations - you've passed all the exercises!`);
      }
    }
    loadPassed();
  }, []);

  useEffect(() => {
    async function loadAttemptCount() {
      const res = await fetch("/api/lessons/3/attempts/count");
      const data = await res.json();
      setAttemptCount(data.attemptCount); // Overwrite React state with DB value
    }

    loadAttemptCount();
  }, []);

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

    await fetch("/api/lessons/3/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correct: allCorrect,
        attemptNum,
      }),
    });
  }

  return (
    <div>
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
            disabled={attemptCount >= maxAttempts}
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
