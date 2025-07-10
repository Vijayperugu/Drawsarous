import React, { useContext } from 'react';
import '../styles/GuessWord.css'
import { GameContext } from '../../context/GameContext';

const RoomCode = () => {
  const { roomCode } = useContext(GameContext);
  const currentWord = "APPLE"
  return (
    <div className='guessing-word'>
      <h2>Word: {currentWord}</h2>
      <h2>Room Code :{roomCode || "No Room Code Available"}</h2>

    </div>
  );
}

export default RoomCode