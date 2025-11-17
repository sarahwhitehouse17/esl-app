import { useState } from "react";

export default function HomePage() {
  const goals = [
    "To improve confidence when speaking",
    "To improve grammatical accuracy",
    "To improve pronunciation",
    "To improve business English and corporate speech",
    "To feel more confident when travelling",
    "To prepare for a course that requires me to study in English",
    "To adopt more idiomatic language and improve fluency",
  ];

  const [goal1, setGoal1] = useState("");
  const [goal2, setGoal2] = useState("");
  const [goal3, setGoal3] = useState("");

  const [message, setMessage] = useState("");

  const handleGoalSelect = async (value, setGoalFn) => {
    setGoalFn(value);
    setMessage("");

    if (!value) return;

    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalTitle: value }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error);
    } else {
      setMessage("Goal added!");
    }
  };

  return (
    <div>
      <h1>Hello Elena ✌️✨</h1>
      <h3>Select your language learning goals</h3>
      <select
        value={goal1}
        onChange={(e) => handleGoalSelect(e.target.value, setGoal1)}
      >
        <option value="">--choose a goal--</option>
        {goals.map((goal) => (
          <option key={goal} value={goal}>
            {goal}
          </option>
        ))}
      </select>
      <select
        value={goal2}
        onChange={(e) => handleGoalSelect(e.target.value, setGoal2)}
      >
        <option value="">--choose a goal--</option>
        {goals.map((goal) => (
          <option key={goal} value={goal}>
            {goal}
          </option>
        ))}
      </select>
      <select
        value={goal3}
        onChange={(e) => handleGoalSelect(e.target.value, setGoal3)}
      >
        <option value="">--choose a goal--</option>
        {goals.map((goal) => (
          <option key={goal} value={goal}>
            {goal}
          </option>
        ))}
      </select>
      {message && <p>{message}</p>}
    </div>
  );
}
