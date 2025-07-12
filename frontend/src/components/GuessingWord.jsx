
import React ,{useContext}from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/GuessWord.css'
import { GameContext } from '../../context/GameContext'

const GuessingWord = () => {
  const { guessingWord } = useContext(GameContext);
  const [currentWord, setCurrentWord] = useState('');
  const navigate = useNavigate();

  const handleLeave = () => {
    localStorage.removeItem('roomCode');
    localStorage.removeItem('hostName');
    navigate('/');

    // Add any additional cleanup logic here
  }
  const renderMaskedWord = (word) => {
    if (!word || word.length === 0) return '';
    if (word.length === 1) return word;
    if (word.length === 2) return word[0] + ' _';

    const middle = word
      .slice(1, -1)
      .replace(/[a-zA-Z]/g, '_ ');
    return word[0] + ' ' + middle + word[word.length - 1];
  };

  return (
    <div className='guessing-word'>
      <h2>Word: {renderMaskedWord(guessingWord)}</h2>
      <button onClick={handleLeave} className='leave-button'>Leave</button>
    </div>
  );
}

export default GuessingWord