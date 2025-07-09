import React, { useRef, useEffect, useContext, useCallback } from 'react'
import '../styles/Canvas.css'
import { GameContext } from '../../context/GameContext.jsx'

const JoinCanvas = () => {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const { socket ,clearCanvas,roomCode} = useContext(GameContext)

  // Set up the canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    ctxRef.current = canvas.getContext('2d')
  }, [])
  useEffect(() => {
  if (!socket) return;
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  socket.on('clear-canvas', handleClear);
  return () => {
    socket.off('clear-canvas', handleClear);
  };
}, [socket]);


  // Handle receiving drawing data from the owner
  const handleReceiveDrawing = useCallback((data) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const { offsetX, offsetY, color, size } = data
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }, [])

  // Listen for receive-drawing socket event
  useEffect(() => {
    if (!socket) return
    socket.on('receive-drawing', handleReceiveDrawing)
    return () => {
      socket.off('receive-drawing', handleReceiveDrawing)
    }
  }, [socket, handleReceiveDrawing])

  return (
    <div className="canvas1-container">
      <div className="canvas2-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          style={{ backgroundColor: 'white', cursor: 'not-allowed' }}
        />
      </div>
    </div>
  )
}

export default JoinCanvas