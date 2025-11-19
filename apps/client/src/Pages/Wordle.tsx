import React, { useState, useEffect } from "react";
import WORDS from "../MockData/words.json";
import wordle from "../Components/WordleChecker";

function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [word] = useState<string>(() => {
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

  function checkLetters(guess: string) {
    return wordle(guess, word);
  }

  function displayColours(result: string[]) {
    let currentProgress = "";
    for (const colour of result) {
      if (colour === "Gray") currentProgress += "◼️";
      else if (colour === "Yellow") currentProgress += "🟨";
      else if (colour === "Green") currentProgress += "🟩";
    }
    return currentProgress;
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
    <div className="play max-w-2xl mx-auto p-6 mt-7 bg-neutral-primary-soft block border-gray-100 rounded-base shadow-xs hover:bg-neutral-secondary-medium items-center bg-gray-100 rounded">
      <h1 className="text-center">WORDLE</h1>

      <div className="previous-guesses text-center">
        {guessResult.map((result, i) => (
          <div className="letter-spacing" key={i}>
            <p className="letter">{guesses[i]}</p>
            <p>{displayColours(result)}</p>
          </div>
        ))}
      </div>

      {guesses.length < 5 && !passed && (
        <form onSubmit={handleSubmit} className="text-center">
          <input
            type="text"
            value={currentGuess}
            onChange={handleChange}
            placeholder="Enter 5 letters"
            maxLength={5}
            required
            pattern="[A-Z]{5}"
            style={{ textTransform: "uppercase" }}
          />
          <button
            type="submit"
            className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none rounded"
          >
            Submit
          </button>
        </form>
      )}

      {guesses.length === 5 && !passed && definition.length > 0 && (
        <div className="text-center pt-5">
          <p>Today's wordle of the day is: {word}</p>
          <p>Word type: {firstWordType}</p>
          <p>Definition: {wordDefinition}</p>
        </div>
      )}
    </div>
  );
}

export default Wordle;
