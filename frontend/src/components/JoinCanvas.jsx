import React, { useRef, useEffect, useContext, useCallback, useState } from 'react'
import '../styles/Canvas.css'
import { GameContext } from '../../context/GameContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx';
import { IoSend } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const JoinCanvas = () => {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [winnerName, setWinnerName] = useState(null);
  const [guessedWord, setGuessedWord] = useState('')
  const [popUpVisible, setPopUpVisible] = useState(false)
  const [notGuessedVisible, setNotGuessedVisible] = useState(false)
  const [guessChatVisible, setGuessChatVisible] = useState(true)
  const { socket, clearCanvas, roomCode, historyDrawings, guessingWord, announceWinner } = useContext(GameContext)
  const { authUser } = useContext(AuthContext)
  const navigate = useNavigate();

  // Set up the canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    ctxRef.current = canvas.getContext('2d')
  }, [])

  // Restore drawing history when it changes
useEffect(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas || !historyDrawings || !Array.isArray(historyDrawings)) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    historyDrawings.forEach(({ offsetX, offsetY, color, size, isNewStroke }) => {
      ctx.lineWidth = size
      ctx.lineCap = 'round'
      ctx.strokeStyle = color
      if (isNewStroke) {
        ctx.beginPath()
        ctx.moveTo(offsetX, offsetY)
      } else {
        ctx.lineTo(offsetX, offsetY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(offsetX, offsetY)
      }
    })
  }, [historyDrawings])

  // Handle clear-canvas event
  useEffect(() => {
    if (!socket) return
    const handleClear = () => {
      const canvas = canvasRef.current
      const ctx = ctxRef.current
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    socket.on('clear-canvas', handleClear)
    return () => {
      socket.off('clear-canvas', handleClear)
    }
  }, [socket])

  // Handle receiving drawing data from the owner
  const handleReceiveDrawing = useCallback((data) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { offsetX, offsetY, color, size, isNewStroke } = data;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    if (isNewStroke) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
  }, []);

  // Listen for receive-drawing socket event
  useEffect(() => {
    if (!socket) return
    socket.on('receive-drawing', handleReceiveDrawing)
    return () => {
      socket.off('receive-drawing', handleReceiveDrawing)
    }
  }, [socket, handleReceiveDrawing])

  // Listen for winner announcement
  useEffect(() => {
    if (!socket) return;
    const handleAnnounceWinner = (winner) => {
      setWinnerName(winner);
      setPopUpVisible(true);
      setGuessChatVisible(false);
    };
    socket.on('announce-winner', handleAnnounceWinner);
    return () => {
      socket.off('announce-winner', handleAnnounceWinner);
    };
  }, [socket]);

 const handleGuessSubmit = (e) => {
  e.preventDefault();
  if (!guessedWord.trim()) {
    alert('Please enter a guess');
    return;
  }
  const cleanedGuess = guessedWord.trim().toLowerCase();
  const cleanedAnswer = guessingWord.trim().toLowerCase();
  if (cleanedGuess === cleanedAnswer) {
    if (socket) {
      socket.emit('winner', { roomCode, winner: authUser.name });
    }
  }else{
    setNotGuessedVisible(true);
    setGuessChatVisible(false);
    setWinnerName(null);
  }
  setGuessChatVisible(false);
  setGuessedWord('');
  setPopUpVisible(true);
};


  return (
    <div className="canvas1-container">
      <div className="canvas2-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: 'white', cursor: 'not-allowed' }}
        />
        {guessChatVisible && (
          <div className="guess-controls">
            <form onSubmit={handleGuessSubmit} >
              <input type="text" className='guess-input' placeholder='Guess The Word' value={guessedWord} onChange={(e) => setGuessedWord(e.target.value)} />
              <button className='guess-button'><IoSend /></button>
            </form>
          </div>
        )}
      </div>

      {notGuessedVisible && !winnerName && (
        <div className='pop-up'>
          <div>
            {guessedWord === guessingWord ?
              <div className='correct'><h3><TiTick /></h3>
                <h2>Correct</h2></div> :
              <div className='correct'>
                <h3 ><FaXmark /></h3>
                <h2>InCorrect</h2>
                <button className='guess-again' onClick={() => {
                  setPopUpVisible(false)
                  setGuessChatVisible(true)
                  setNotGuessedVisible(false)
                  setGuessedWord('')
                }}>Try Again</button>
              </div>
            }
          </div>
        </div>
      )}

      {winnerName && popUpVisible && (
        <div className='pop-up'>
          <div>
            <div className='correct'>
              <h3><TiTick /></h3>
              <h2>{winnerName} guessed the word!</h2>
              <button className='guess-again' onClick={() => {
                setPopUpVisible(false);
                setGuessChatVisible(true);
                setGuessedWord('');
                setWinnerName(null);
                localStorage.removeItem('roomCode');
                localStorage.removeItem('hostName');
                navigate('/'); // Redirect to home page
                
              }}>Exit Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JoinCanvas