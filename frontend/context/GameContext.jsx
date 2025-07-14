import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Backend_URL = import.meta.env.VITE_BACKEND_URLL;

export const GameContext = createContext()

export const GameProvider = ({ children }) => {
  const [roomName, setRoomName] = useState('')
  const [roomCode, setRoomCode] = useState(null)
  const [username, setUsername] = useState('')
  const [players, setPlayers] = useState([])
  const [historyDrawings, setHistoryDrawings] = useState([]);
  const [historyMessages, setHistoryMessages] = useState([]);
  const [guessingWord, setGuessingWord] = useState('');
  const [winner, setWinner] = useState(null);
  const { socket, authUser } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    const msgHistory = async () => {
      if (roomCode) {
        const res = await axios.get(`${Backend_URL}/api/user/getMessageHistory/${roomCode}`);
        if (res.data && res.data.success) {
          setHistoryMessages(res.data.history);
        } else {
          setHistoryDrawings([]);
        }
      }
    }
    msgHistory();
  }, [roomCode]);

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
          const { data } = await axios.get(`${import.meta.env.Backend_URL}/api/user/roomActive/${savedRoom}`);

          if (data.active) {
            console.log("Guessing word:", data.guessingWord);
            setRoomCode(savedRoom);
            setRoomName(data.roomName);
            setGuessingWord(data.guessingWord);
            const drawingRes = await axios.get(`${Backend_URL}/api/user/getDrawingHistory/${savedRoom}`);
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
        const { data } = await axios.get(`${Backend_URL}/api/user/roomActive/${savedRoom}`);
        if (data.active) {
          setGuessingWord(data.guessingWord);
          setRoomName(data.roomName);
          const drawingRes = await axios.get(`${Backend_URL}/api/user/getDrawingHistory/${savedRoom}`);
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

  const sendMessage = async ({ roomCode, message, username }) => {
    if (socket) {
      socket.emit('send-message', { roomCode, message, username: authUser.name })
    }
    const res = await axios.post(`${Backend_URL}/api/user/addMessages`, {
      roomCode,
      message: { message, username: authUser.name }
    });
    if (res.data.success) {
      setHistoryMessages(prev => [...prev, { message, username: authUser.name }]);
    }
  }

  const sendDrawing = (data, roomCode) => {
    socket.emit('send-drawing', { roomCode, drawing: data })
    const { res } = axios.post(`${Backend_URL}/api/user/addDrawing`, {
      roomCode,
      drawing: data
    })
    if (data.success) {
      setHistoryDrawings(prev => [...prev, data.drawing])
    }
  }

  const clearDrawingHistory = async (roomCode) => {
    try {
      const { data } = await axios.post(`${Backend_URL}/api/user/clearDrawingHistory`, { roomCode });
      if (data.success) {
        setHistoryDrawings([]);
      }
    } catch (error) {
      console.error("Error clearing drawing history:", error);
    }
  }

  const deleteRoom = async (roomCode) => {
    try {
      const { data } = await axios.post(`${Backend_URL}/api/user/deleteRoom/${roomCode}`);
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

  const announceWinner = (roomCode, winner) => {
    if (socket) {
      socket.emit('winner', { roomCode, winner });
      setWinner(winner);
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
    deleteRoom,
    historyMessages,
    setHistoryMessages,
    winner,
    announceWinner,
  }

  return (

    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}