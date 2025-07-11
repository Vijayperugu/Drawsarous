import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GameContext = createContext()

export const GameProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null)
  const [username, setUsername] = useState('')
  const [players, setPlayers] = useState([])
  const { socket, authUser } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = ({ username }) => {
      setPlayers((prev) => [...prev, { username }])
    }

    socket.on('player-joined', handlePlayerJoined)

    return () => {
      socket.off('player-joined', handlePlayerJoined)
    }
  }, [socket])
  useEffect(() => {
    const checkRoomActive = async () => {
        const savedRoom = localStorage.getItem('roomCode');
        const hostUser = localStorage.getItem('hostName') || '';
        if (savedRoom && (hostUser !== authUser.name)) {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/user/roomActive/${savedRoom}`);
                if (data.active) {
                    joinRoomSocket({ roomCode: savedRoom, username: authUser.name });
                    navigate('/joinRoom');
                }
            } catch (error) {
                console.error("Error checking room active status:", error);
            }
        }
    };
    checkRoomActive();
}, [authUser,socket]);

  const joinRoomSocket = ({ roomCode, username }) => {
    if (socket) {
      socket.emit('join-room', { roomCode, username })
      setRoomCode(roomCode)
      setUsername(username)
      localStorage.setItem('roomCode', roomCode);
    }
  }
  const clearCanvas = ({ roomCode }) => {
    if (socket) {
      socket.emit('clear-canvas', { roomCode })
    }
  }

  const sendMessage = ({ roomCode,message,username }) => {
    if (socket) {
      socket.emit('send-message', { roomCode, message, username: authUser.name })
    }
  }
  
  const sendDrawing = (data) => {
    socket.emit('send-drawing', { roomCode, drawing: data })
  }
  const value = {
    roomCode,
    username,
    players,
    joinRoomSocket,
    sendDrawing,
    socket,
    clearCanvas,
    sendMessage
  }

  return (

    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}