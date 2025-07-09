import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext.jsx';

export const GameContext = createContext()

export const GameProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null)
  const [username, setUsername] = useState('')
  const [players, setPlayers] = useState([])
  const { socket } = useContext(AuthContext)


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

  const joinRoomSocket = ({ roomCode, username }) => {
    if (socket) {
      socket.emit('join-room', { roomCode, username })
      setRoomCode(roomCode)
      setUsername(username)
    }
  }
  const clearCanvas = ({ roomCode }) => {
    if (socket) {
      socket.emit('clear-canvas', { roomCode })
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
    clearCanvas
  }

  return (

    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}