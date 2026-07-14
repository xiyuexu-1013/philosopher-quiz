import React, { useState } from 'react';
import { QUESTIONS } from '../data/questions';

export default function Quiz({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (choiceKey) => {
    const newAnswers = { ...answers, [currentQuestion.id]: choiceKey };
    setAnswers(newAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300); // 增加微小延迟，提升点击反馈感
    } else {
      onComplete(newAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="card fade-in">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="quiz-header">
        <span className="section-tag">{currentQuestion.section}</span>
        <span className="question-count">{currentIndex + 1} / {QUESTIONS.length}</span>
      </div>

      <h2 className="question-text">{currentQuestion.text}</h2>

      <div className="options-container">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt.key}
            className={`option-btn ${answers[currentQuestion.id] === opt.key ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.key)}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {currentIndex > 0 && (
        <button className="text-btn" onClick={handlePrev}>
          ← 返回上一题
        </button>
      )}
    </div>
  );
}
