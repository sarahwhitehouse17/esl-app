import { useState, useEffect } from "react";

export default function HomePage() {
  const allGoals = [
    "To improve confidence when speaking",
    "To improve grammatical accuracy",
    "To improve pronunciation",
    "To improve business English and corporate speech",
    "To feel more confident when travelling",
    "To prepare for a course that requires me to study in English",
    "To adopt more idiomatic language and improve fluency",
  ];

  const [goals, setGoals] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  // Load existing goals from backend
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (res.ok) {
        setGoals(data.map((g: any) => g.goalTitle));
      }
    }
    load();
  }, []);

  // Add a selected goal
  async function handleSelect(value: string, index: number) {
    if (!value) return;

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalTitle: value }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    const copy = [...goals];
    copy[index] = value;
    setGoals(copy);
    setMessage("Goal added!");
  }

  // Remove already-selected goals from options
  function optionsForDropdown() {
    return allGoals.filter((g) => !goals.includes(g));
  }

  return (
    <div>
      <h1>Hello Elena ✌️✨</h1>

      <h3>Your selected goals:</h3>
      {goals.map((g, i) => (
        <p key={i}>• {g}</p>
      ))}

      {/* Only show form if the user has fewer than 3 goals */}
      {goals.length < 3 && (
        <div>
          <h3>Select a new goal:</h3>

          <select
            value=""
            onChange={(e) => handleSelect(e.target.value, goals.length)}
          >
            <option value="">-- choose a goal --</option>

            {optionsForDropdown().map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>
      )}
      <h3>Total number of hours studied</h3>
      <h4>96 hours</h4>
      <h3>Your areas of foucs over the next four weeks</h3>
      <ul>
        <li>Add target</li>
        <li>Add target</li> <li>Add target</li> <li>Add target</li>
      </ul>
      <h4>Your current level: B2.4 - Intermediate</h4>

      {message && <p>{message}</p>}
    </div>
  ); // ← closes return
} // ← closes HomePage()
