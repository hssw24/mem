import React, { useState, useEffect } from 'react';
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

  const handleCardClick = (index) => {
    // Ignorieren, wenn die Karte schon umgedreht oder ein Match ist
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;

    // Karte umdrehen
    setFlippedCards([...flippedCards, index]);

    // Wenn zwei Karten umgedreht sind, prüfen
    if (flippedCards.length === 1) {
      const firstCardIndex = flippedCards[0];
      const secondCardIndex = index;

      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (
        (firstCard.type === 'question' && firstCard.answer === secondCard.answer) ||
        (firstCard.type === 'answer' && firstCard.answer === secondCard.answer)
      ) {
        // Wenn sie übereinstimmen, hinzufügen zu den gefundenen Paaren
        setMatchedCards([...matchedCards, firstCardIndex, secondCardIndex]);
      }

      // Zurücksetzen der umgedrehten Karten nach kurzer Verzögerung
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="App">
      <h1>Zahlen-Memory</h1>
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${flippedCards.includes(index) || matchedCards.includes(index) ? 'flipped' : ''}`}
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
    </div>
  );
}

export default App;
