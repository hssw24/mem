import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const generateCards = () => {
  const mathProblems = [
    { question: '4 + 7', answer: 11 },
    { question: '5 + 6', answer: 11 },
    { question: '13 + 3', answer: 16 },
    { question: '15 - 4', answer: 11 },
    { question: '20 - 7', answer: 13 },
    { question: '12 + 5', answer: 17 },
    { question: '10 + 8', answer: 18 },
    { question: '6 + 9', answer: 15 }
  ];

  // Duplizieren der Aufgaben (einmal Frage, einmal Antwort)
  const cards = mathProblems.flatMap(problem => [
    { ...problem, type: 'question' },
    { question: problem.answer, answer: problem.answer, type: 'answer' }
  ]);

  // Karten mischen
  return cards.sort(() => Math.random() - 0.5);
};

function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  // Start den Timer bei Spielbeginn
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 10); // 10-Sekunden-Intervalle
    }, 10000);

    return () => clearInterval(timerRef.current); // Timer beim Beenden des Spiels stoppen
  }, []);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      // Spielende
      clearInterval(timerRef.current);
      setGameOver(true);
      setTotalAttempts(totalAttempts + attempts);
      setTotalTime(totalTime + time);
    }
  }, [matchedCards, cards]);

  const handleCardClick = (index) => {
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;

    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 1) {
      setAttempts(attempts + 1); // Zähle einen neuen Versuch
      const firstCardIndex = flippedCards[0];
      const secondCardIndex = index;

      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (
        (firstCard.type === 'question' && firstCard.answer === secondCard.answer) ||
        (firstCard.type === 'answer' && firstCard.answer === secondCard.answer)
      ) {
        setMatchedCards([...matchedCards, firstCardIndex, secondCardIndex]);
      }

      // Zurückdrehen der Karten nach 3 Sekunden
      setTimeout(() => {
        setFlippedCards([]);
      }, 3000);
    }
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMatchedCards([]);
    setAttempts(0);
    setTime(0);
    setGameOver(false);

    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 10); // Timer wieder starten
    }, 10000);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="App">
      <h1>Zahlen-Memory</h1>
      <div>
        <p>Versuche: {attempts}</p>
        <p>Zeit: {formatTime(Math.floor(time / 10))}</p>
      </div>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''} 
              ${matchedCards.includes(index) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {(flippedCards.includes(index) || matchedCards.includes(index)) ? (
              <span>{card.type === 'question' ? card.question : card.answer}</span>
            ) : (
              <span>?</span>
            )}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-over">
          <h2>Spiel beendet!</h2>
          <p>Anzahl der Runden: {rounds + 1}</p>
          <p>Anzahl der Versuche in dieser Runde: {attempts}</p>
          <p>Verstrichene Zeit: {formatTime(Math.floor(time / 10))}</p>
          <p>Gesamtzeit: {formatTime(Math.floor(totalTime / 10))}</p>
          <p>Gesamtzahl der Versuche: {totalAttempts}</p>
          <button onClick={() => { setRounds(rounds + 1); resetGame(); }}>Nochmal spielen</button>
        </div>
      )}
    </div>
  );
}

export default App;
