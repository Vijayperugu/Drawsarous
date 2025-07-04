
import React from 'react'
import { useState, useEffect } from 'react'
import words from '../Words'
import '../styles/GuessWord.css'

const GuessingWord = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);


  useEffect(() => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  }, []);

  useEffect(() => {


    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


  return (
    <div className='guessing-word'>
      <h2>Word: {currentWord[0] + currentWord.slice(1, -1).replace(/[a-zA-Z]/g, "_ ") + currentWord[currentWord.length - 1]}</h2>
      <h2>Timer: {formatTime(timeLeft)}</h2>

    </div>
  );
}

export default GuessingWord