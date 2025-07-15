import React, { useRef, useEffect, useState, useContext, useCallback } from 'react'
import '../styles/Canvas.css'
import { GameContext } from '../../context/GameContext.jsx'
import { TiTick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';

const CreateCanvas = () => {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(4)
  const [winnerName, setWinnerName] = useState(null)
  const [popUpVisible, setPopUpVisible] = useState(false)
  const { sendDrawing, roomCode, clearCanvas, clearDrawingHistory, historyDrawings, socket, deleteRoom } = useContext(GameContext)
  const navigate = useNavigate();

  // Draw function
  const draw = useCallback((event) => {
    if (!drawing) return
    const ctx = ctxRef.current
    if (!ctx) return
    const { offsetX, offsetY } = event

    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)

    if (sendDrawing) {
      sendDrawing(
        { offsetX, offsetY, color, size, isNewStroke: false },
        roomCode
      )
    }
  }, [drawing, color, size, sendDrawing, roomCode])

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    handleMouseDown({
      nativeEvent: {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      }
    });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    draw({
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    });
  };

  // On mouse down, start a new stroke
  const handleMouseDown = (event) => {
    setDrawing(true)
    // Send the first point as a new stroke
    if (sendDrawing) {
      const { offsetX, offsetY } = event.nativeEvent
      sendDrawing(
        { offsetX, offsetY, color, size, isNewStroke: true },
        roomCode
      )
    }
    const ctx = ctxRef.current
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
    }
  }

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

  useEffect(() => {
    const canvas = canvasRef.current
    ctxRef.current = canvas.getContext('2d')
  }, [])

  // Only add mousemove listener when drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (event) => draw(event)

    if (drawing) {
      canvas.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [drawing, draw])

  // Listen for winner announcement
  useEffect(() => {
    if (socket) {
      const handleAnnounceWinner = (winner) => {
        setWinnerName(winner);
        setPopUpVisible(true);
      };
      socket.on('announce-winner', handleAnnounceWinner);
      return () => {
        socket.off('announce-winner', handleAnnounceWinner);
      };
    }
  }, [socket]);

  return (
    <div className="canvas1-container">
      <div className="canvas2-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseUp={() => {
            setDrawing(false)
            const ctx = ctxRef.current
            if (ctx) ctx.beginPath()
          }}
          onMouseLeave={() => {
            setDrawing(false)
            const ctx = ctxRef.current
            if (ctx) ctx.beginPath()
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setDrawing(false)}
          style={{ backgroundColor: 'white', cursor: 'crosshair' }}
        />
        <div className="controls">
          <div>
            <label htmlFor="colorPicker">Color:</label>
            <input type="color" id="colorPicker" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div>
            <label htmlFor="brushSize">Size:</label>
            <input type="range" id="brushSize" min="1" max="20" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
          <button
            className="clear"
            onClick={() => {
              const canvas = canvasRef.current
              const ctx = ctxRef.current
              if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
              clearCanvas({ roomCode })
              clearDrawingHistory(roomCode)
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {winnerName && popUpVisible && (
        <div className='pop-up'>
          <div>
            <div className='correct'>
              <h3><TiTick /></h3>
              <h2>{winnerName} guessed the word!</h2>
              <button className='guess-again' onClick={() => {
                setPopUpVisible(false);
                setWinnerName(null);
                deleteRoom(roomCode);
                localStorage.removeItem('roomCode');
                localStorage.removeItem('hostName');
                navigate('/');
              }}>Exit Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCanvas