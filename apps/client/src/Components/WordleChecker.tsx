const GREEN = "Green";
const YELLOW = "Yellow";
const GRAY = "Gray";

function wordle(guess: string, wordle: string) {
  const guessArr: string[] = guess.split("");
  const wordleArr: string[] = wordle.split("");
  const result = new Array(wordleArr.length).fill(GRAY);

  for (let i = 0; i < wordleArr.length; i++) {
    if (wordleArr[i] === guessArr[i]) {
      result[i] = GREEN;
      guessArr[i] = null;
      wordleArr[i] = null;
    }
  }
  for (let i = 0; i < guessArr.length; i++) {
    if (guessArr[i] !== null) {
      const matchIndex = wordleArr.indexOf(guessArr[i]);
      if (matchIndex !== -1) {
        result[i] = YELLOW;
        wordleArr[matchIndex] = null;
        guessArr[i] = null;
      }
    }
  }
  return result;
}

export default wordle;
