import React, { useContext } from 'react';
import '../styles/GuessWord.css'
import { GameContext } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';

const RoomCode = () => {
  const { roomCode, guessingWord, deleteRoom } = useContext(GameContext);
  const navigate = useNavigate();
  const handleClick = ()=>{
    if(roomCode){
      deleteRoom(roomCode);
      localStorage.removeItem('roomCode');
      localStorage.removeItem('hostName');
      navigate('/');
    }
  }
  return (
    <div className='guessing-word'>
      <h2>Word: {guessingWord || "No Word Available"}</h2>
      <h2>Room Code :{roomCode || "No Room Code Available"}</h2>
      <button className='leave-button' onClick={handleClick}>Exit</button>
    </div>
  );
}

export default RoomCode