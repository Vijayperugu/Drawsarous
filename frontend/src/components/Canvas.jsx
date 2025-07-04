import React from 'react'
import { useRef, useEffect, useState } from 'react';
import '../styles/Canvas.css'

const Canvas = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [size, setSize] = useState(4);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = (event) => {
            if (!drawing) return;

            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;

            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
        };

        canvas.addEventListener('mousemove', draw);
        return () => canvas.removeEventListener('mousemove', draw);
    }, [drawing, color, size]);

    const handleMouseDown = () => {
        setDrawing(true);
    };

    const handleMouseUp = () => {
        setDrawing(false);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="canvas1-container">
            <div className="canvas2-container">
                <canvas ref={canvasRef} width={800} height={500} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} style={{ backgroundColor: 'white' }}
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
                    <button className="clear" onClick={clearCanvas}>Clear</button>
                </div>
            </div>
        </div>
    )
}

export default Canvas