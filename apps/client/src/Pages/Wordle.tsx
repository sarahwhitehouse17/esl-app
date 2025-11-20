import React, { useState, useEffect } from "react";
import WORDS from "../MockData/words.json";
import wordle from "../Components/WordleChecker";

function Wordle() {
  const [guesses, setGuesses] = useState<string[]>(() => {
    const saved = localStorage.getItem("wordleGuesses");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentGuess, setCurrentGuess] = useState("");
  const [word] = useState(() => {
    const saved = localStorage.getItem("wordleWord");
    if (saved) {
      return saved;
    }
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  });
  const [guessResult, setResult] = useState<string[][]>([]);
  const [definition, setDefinition] = useState<any[]>([]); // holds API data

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentGuess(e.target.value.toUpperCase());
  }

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (currentGuess.length === 5) {
      const newGuessResult = checkLetters(currentGuess);
      setGuesses([...guesses, currentGuess]);
      setResult([...guessResult, newGuessResult]);
      setCurrentGuess("");
    }
  }

  useEffect(() => {
    localStorage.setItem("wordleGuesses", JSON.stringify(guesses));
    localStorage.setItem("wordleWord", word);
  }, [guesses, word]);

  function checkLetters(guess: string) {
    return wordle(guess, word);
  }

  function displayColours(result) {
    return result.map((r) => {
      if (r === "Green") return "bg-green-500";
      if (r === "Yellow") return "bg-yellow-500";
      return "bg-gray-500";
    });
  }

  function resetGame() {
    localStorage.removeItem("wordleGuesses");
    localStorage.removeItem("wordleWord");

    window.location.reload();
  }

  useEffect(() => {
    async function getDefinition(word: string) {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const words = await response.json();

      const result = words.flatMap((word: any) =>
        word.meanings.flatMap((meaning: any) =>
          meaning.definitions.map((definition: any) => ({
            ...definition,
            type: meaning.partOfSpeech,
          }))
        )
      );

      setDefinition(result);
    }

    getDefinition(word);
  }, [word]);

  const firstWordType = definition?.[0]?.type ?? "";
  const wordDefinition = definition?.[0]?.definition ?? "";

  const lastResult = guessResult[guessResult.length - 1];
  const passed = lastResult?.every((colour) => colour === "Green");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="play mx-auto p-6 bg-neutral-primary-soft border-gray-100 rounded-base shadow-xs hover:bg-neutral-secondary-medium items-center bg-white-100 rounded md:flex-row w-full max-w-4xl bg-white rounded-2xl">
        <h1 className="text-center text-2xl font-semibold mb-4">WORDLE</h1>
        <div className="flex flex-col items-center gap-3">
          {guessResult.map((result, i) => {
            const colours = displayColours(result);

            return (
              <div key={i} className="flex gap-2">
                {guesses[i].split("").map((char, j) => (
                  <div
                    key={j}
                    className={`w-10 h-10 flex items-center justify-center text-xl font-bold border
              ${colours[j]}`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {guesses.length < 5 && !passed && (
          <form onSubmit={handleSubmit} className="text-center mt-5">
            <input
              type="text"
              value={currentGuess}
              onChange={handleChange}
              placeholder="ENTER 4 LETTERS"
              maxLength={5}
              required
              pattern="[A-Z]{5}"
              className="border border-gray-300 rounded-md px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none rounded"
            >
              Submit
            </button>
          </form>
        )}
        {passed && (
          <div className="text-center pt-5 rounded">
            <p className="mt-5">
              Well done on successfully getting today's word!
            </p>
            <p className="mt-5 text-lg font-semibold">{word}</p>
            <p className="mt-5">Word type: {firstWordType}</p>
            <p className="mt-5">Definition: {wordDefinition}</p>
            <button
              onClick={resetGame}
              type="button"
              className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Play again
            </button>
          </div>
        )}

        {guesses.length === 5 && !passed && definition.length > 0 && (
          <div className="text-center pt-5 rounded">
            <p>Today's wordle of the day is: {word}</p>
            <p className="mt-5">Word type: {firstWordType}</p>
            <p className="mt-5">Definition: {wordDefinition}</p>
            <button
              onClick={resetGame}
              type="button"
              className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wordle;
