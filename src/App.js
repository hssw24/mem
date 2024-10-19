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
  const [isChecking, setIsChecking] = useState(false);  // Verhindert, dass während des Vergleichs weitere Karten aufgedeckt werden

  const timerRef = useRef(null);

  // Start den Timer bei Spielbeginn
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Zeit in Sekunden zählen
    }, 1000);

    return () => clearInterval(timerRef.current); // Timer beim Beenden des Spiels stoppen
  }, []);

  // Prüfen, ob das Spiel zu Ende ist (alle Karten gefunden)
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
    // Verhindere Klicken während des Kartenvergleichs oder wenn die Karte schon umgedreht ist
    if (isChecking || flippedCards.includes(index) || matchedCards.includes(index)) return;

    // Karte umdrehen
    setFlippedCards([...flippedCards, index]);

    // Wenn zwei Karten umgedreht sind, Versuche zählen und die Karten vergleichen
    if (flippedCards.length === 1) {
      setAttempts(attempts + 1);
      const firstCardIndex = flippedCards[0];
      const secondCardIndex = index;

      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (
        (firstCard.type === 'question' && firstCard.answer === secondCard.answer) ||
        (firstCard.type === 'answer' && firstCard.answer === secondCard.answer)
      ) {
        // Übereinstimmung: Karten als "gefunden" markieren und weiter spielen
        setMatchedCards([...matchedCards, firstCardIndex, secondCardIndex]);
        setFlippedCards([]);
      } else {
        // Keine Übereinstimmung: Wartezeit von 3 Sekunden, dann zurückdrehen
        setIsChecking(true);  // Sperren, bis der Vergleich abgeschlossen ist
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);  // Entsperren nach dem Vergleich
        }, 3000);
      }
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
      setTime(prevTime => prevTime + 1);
    }, 1000);
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
        <p>Versuche: {attempts} · 
        Zeit: {formatTime(time)}</p>
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
          <p>Versuche in dieser Runde: {attempts} · 
          Zeit in dieser Runde: {formatTime(time)} · 
          Gesamtzeit: {formatTime(totalTime)} · 
          Gesamtzahl der Versuche: {totalAttempts}</p>
          <button onClick={() => { setRounds(rounds + 1); resetGame(); }}>Nochmal spielen</button>
        </div>
      )}
    </div>
  );
}

export default App;
