import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./App.css";
import Die from "./components/Die";

function App() {
  const [dice, setDice] = useState(allNewDice());

  //represents whether the user has won the game yet or not
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValues = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValues) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    let numArray = [];
    for (let i = 0; i < 10; i++) {
      // ceil starts from 1 (rand nums from 1 to 6)
      numArray.push(generateNewDie());
    }
    return numArray;
  }

  function rollDice() {
    if (tenzies) {
      //time for new game, reset dices
      setTenzies(false);
      setDice(allNewDice());
    } else {
      setDice((oldDice) =>
        oldDice.map((dice) => {
          //if the die isn't held, update its value
          return dice.isHeld ? dice : generateNewDie();
        })
      );
    }
  }

  function holdDice(id) {
    //update dice state by checking the id selected and fliping the isHeld value
    setDice((oldDice) =>
      oldDice.map((dice) =>
        dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice
      )
    );
  }

  const diceNumbersElements = dice.map((dice) => (
    <Die
      key={dice.id}
      value={dice.value}
      isHeld={dice.isHeld}
      handleHoldDice={() => holdDice(dice.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceNumbersElements}</div>
      <button className="roll-button" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
