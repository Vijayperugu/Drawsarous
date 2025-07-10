
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



  return (
    <div className='guessing-word'>
      <h2>Word: {currentWord[0] + currentWord.slice(1, -1).replace(/[a-zA-Z]/g, "_ ") + currentWord[currentWord.length - 1]}</h2>

    </div>
  );
}

export default GuessingWord