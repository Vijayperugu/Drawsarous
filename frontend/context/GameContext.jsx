import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GameContext = createContext()

export const GameProvider = ({ children }) => {
  const [roomName, setRoomName] = useState('')
  const [roomCode, setRoomCode] = useState(null)
  const [username, setUsername] = useState('')
  const [players, setPlayers] = useState([])
  const [historyDrawings, setHistoryDrawings] = useState([]);
  const [guessingWord, setGuessingWord] = useState('');
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
      const host = localStorage.getItem('hostName');
      if (authUser && socket && savedRoom && host !== authUser.name) {
        try {
          // Check if room is active
          const { data } = await axios.get(`http://localhost:8000/api/user/roomActive/${savedRoom}`);

          if (data.active) {
            console.log("Guessing word:", data.guessingWord);
            setRoomCode(savedRoom);
            setRoomName(data.roomName);
            setGuessingWord(data.guessingWord);
            const drawingRes = await axios.get(`http://localhost:8000/api/user/getDrawingHistory/${savedRoom}`);
            if (drawingRes.data && drawingRes.data.success) {
              setHistoryDrawings(drawingRes.data.history);
            } else {
              setHistoryDrawings([]);
            }
            joinRoomSocket({ roomCode: savedRoom, username: authUser.name });
            navigate('/joinRoom');
          }
        } catch (error) {
          console.error("Error checking room active status or fetching drawing history:", error);
        }
      } else if (authUser && socket && savedRoom && host === authUser.name) {
        const { data } = await axios.get(`http://localhost:8000/api/user/roomActive/${savedRoom}`);
        if (data.active) {
          setGuessingWord(data.guessingWord);
          setRoomName(data.roomName);
          const drawingRes = await axios.get(`http://localhost:8000/api/user/getDrawingHistory/${savedRoom}`);
          if (drawingRes.data && drawingRes.data.success) {
            setHistoryDrawings(drawingRes.data.history);
          } else {
            setHistoryDrawings([]);
          }
          joinRoomSocket({ roomCode: savedRoom, username: authUser.name });
        }
        navigate('/createRoom');

      } else {

        navigate('/');
      }
    };
    checkRoomActive();
  }, [authUser, socket]);

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

  const sendMessage = ({ roomCode, message, username }) => {
    if (socket) {
      socket.emit('send-message', { roomCode, message, username: authUser.name })
    }
  }

  const sendDrawing = (data, roomCode) => {
    socket.emit('send-drawing', { roomCode, drawing: data })
    const { res } = axios.post('http://localhost:8000/api/user/addDrawing', {
      roomCode,
      drawing: data
    })
    if (data.success) {
      setHistoryDrawings(prev => [...prev, data.drawing])
    }
  }

  const clearDrawingHistory = async (roomCode) => {
    try {
      const { data } = await axios.post('http://localhost:8000/api/user/clearDrawingHistory', { roomCode });
      if (data.success) {
        setHistoryDrawings([]);
      }
    } catch (error) {
      console.error("Error clearing drawing history:", error);
    }
  }

  const deleteRoom = async (roomCode) => {
    try {
      const { data } = await axios.post(`http://localhost:8000/api/user/deleteRoom/${roomCode}`);
      if (data.success) {
        setRoomCode(null);
        setRoomName(null);
        setGuessingWord(null);
        setHistoryDrawings([]);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  }

  const value = {
    roomCode,
    username,
    players,
    joinRoomSocket,
    sendDrawing,
    socket,
    clearCanvas,
    sendMessage,
    historyDrawings,
    clearDrawingHistory,
    roomName,
    guessingWord,
    setGuessingWord,
    setRoomName,
    setRoomCode,
    deleteRoom
  }

  return (

    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}