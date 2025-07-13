
import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/GuessWord.css'
import { HiPaintBrush } from "react-icons/hi2";
import { GameContext } from '../../context/GameContext'

const GuessingWord = () => {
  const { guessingWord } = useContext(GameContext);
  const [guessingInput, setGuessingInput] = useState('');
  const navigate = useNavigate();

  const handleLeave = () => {
    localStorage.removeItem('roomCode');
    localStorage.removeItem('hostName');
    navigate('/');
  }

  const renderMaskedWord = (word) => {
    const middle = word
      .slice(1, -1)
      .replace(/[a-zA-Z]/g, '_ ');
    return word[0] + ' ' + middle + word[word.length - 1];
  };
  return (
    <div className='guessing-word'>
      <h2>Word: {renderMaskedWord(guessingWord) || "N/A"}</h2>
      {/* <h2>word:APPLE</h2> */}
      {/* <h2><HiPaintBrush />Guessing... </h2> */}
      <button onClick={handleLeave} className='leave-button'>Leave</button>
    </div>
  );
}

export default GuessingWord