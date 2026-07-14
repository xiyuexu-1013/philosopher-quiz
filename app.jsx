import React, { useState } from 'react';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { getFinalResult } from './data/matching';
import './index.css';

export default function App() {
  const [step, setStep] = useState('welcome'); // 'welcome', 'quiz', 'result'
  const [answers, setAnswers] = useState({});
  const [finalResult, setFinalResult] = useState(null);

  const handleStart = () => setStep('quiz');

  const handleComplete = (userAnswers) => {
    setAnswers(userAnswers);
    // 调用算法引擎计算结果
    const result = getFinalResult(userAnswers);
    setFinalResult(result);
    setStep('result');
  };

  const handleRestart = () => {
    setAnswers({});
    setFinalResult(null);
    setStep('welcome');
  };

  return (
    <div className="app-container">
      {step === 'welcome' && <Welcome onStart={handleStart} />}
      {step === 'quiz' && <Quiz onComplete={handleComplete} />}
      {step === 'result' && <Result result={finalResult} onRestart={handleRestart} />}
    </div>
  );
}
