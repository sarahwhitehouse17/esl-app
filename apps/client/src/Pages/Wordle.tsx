import React, { useState } from "react";
import WORDS from "../MockData/words.json";
import wordle from "../Components/WordleChecker";

function Wordle() {
  const [guesses, setGuesses] = useState<string[]>([]); //returns array of strings
  const [currentGuess, setCurrentGuess] = useState("");
  const [word] = useState<string>(() => {
    //use a lazy initialiser...
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  });
  const [guessResult, setResult] = useState<string[][]>([]); //return array of arrays

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
    const result = wordle(guess, word); //updated from let
    return result;
  }

  function displayColours(result: string[]) {
    //THINK THIS MIGHT NEED TO BE OBJECT/ARRAY
    let currentProgress = "";
    for (const colour of result) {
      //message --> Colour is never changed. Change to const instead. Originally 'let'
      if (colour === "Gray") {
        currentProgress += "◼️";
      } else if (colour === "Yellow") {
        currentProgress += "🟨";
      } else if (colour === "Green") {
        currentProgress += "🟩";
      }
    }
    return currentProgress;
  }

  const lastResult = guessResult[guessResult.length - 1];

  const passed = lastResult?.every((colour) => colour === "Green");

  return (
    <div className="play max-w-2xl mx-auto p-6 mt-7">
      <h1 className="text-center">WORDLE</h1>

      <div className="previous-guesses text-center">
        {guessResult.map((result, i) => (
          <div className="letter-spacing">
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
          <button type="submit">Submit</button>
        </form>
      )}
      {guesses.length === 5 && !passed && (
        <div className="text-center pt-5">
          Today's wordle of the day is: {word}
        </div>
      )}
    </div>
  );
}

export default Wordle;
