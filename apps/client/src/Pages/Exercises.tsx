import { useEffect, useState } from "react";

type Word = {
  id: number;
  word: string;
  definition: string;
};

export default function MatchingExercise() {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    async function loadWords() {
      const res = await fetch("/api/lessons/3/words");
      const data = await res.json();
      setWords(data);
    }

    loadWords();
  }, []);

  const definitions = [...words]
    .map((w) => w.definition)
    .sort(() => Math.random() - 0.5);

  return (
    <div>
      <h2>Match the words to their definitions</h2>

      <div className="container">
        <div className="words">
          <h3>Words</h3>
          {words.map((item) => (
            <p key={item.id}>{item.term}</p>
          ))}
        </div>

        <div className="definitions">
          <h3>Definitions</h3>
          {definitions.map((def, index) => (
            <p key={index}>{def}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// export default function ExercisesPage() {
//   return (
//     <div>
//       <h1>Exercises</h1>
//       <p>Match the words!</p>
//       <div>
//         <input type="text" placeholder="the word" />
//         <input type="dropdown" placeholder="the definition"></input>
//       </div>
//       <div>
//         <input type="text" placeholder="the word" />
//         <input type="dropdown" placeholder="the definition"></input>
//       </div>
//       <div>
//         <input type="text" placeholder="the word" />
//         <input type="dropdown" placeholder="the definition"></input>
//       </div>
//       <div>
//         <input type="text" placeholder="the word" />
//         <input type="dropdown" placeholder="the definition"></input>
//       </div>
//       <div>
//         <input type="text" placeholder="the word" />
//         <input type="dropdown" placeholder="the definition"></input>
//       </div>
//       <button type="submit">Submit</button>
//     </div>
//   );
// }
