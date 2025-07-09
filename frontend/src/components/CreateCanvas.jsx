import React, { useRef, useEffect, useState, useContext, useCallback } from 'react'
import '../styles/Canvas.css'
import { GameContext } from '../../context/GameContext.jsx'

const CreateCanvas = () => {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(4)
  const { sendDrawing ,roomCode} = useContext(GameContext);

  // Define draw BEFORE useEffect that uses it!
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
      sendDrawing({ offsetX, offsetY, color, size })
    }
  }, [drawing, color, size, sendDrawing])

  useEffect(() => {
    const canvas = canvasRef.current
    ctxRef.current = canvas.getContext('2d')
  }, [])

  // Only add mousemove listener when drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (event) => draw(event);

    if (drawing) {
      canvas.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [drawing, draw])
  return (
    <div className="canvas1-container">
      <div className="canvas2-container">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={() => setDrawing(true)}
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
          style={{ backgroundColor: 'white' }}
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
              const canvas = canvasRef.current;
              const ctx = ctxRef.current;
              if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
              clearCanvas({ roomCode });
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCanvas