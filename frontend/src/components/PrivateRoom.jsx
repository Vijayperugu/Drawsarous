import React, { useContext, useState } from 'react'
import { FaLock } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import axios from 'axios'
import { GameContext } from '../../context/GameContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import "../styles/PrivateRoom.css"
const Backend_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PrivateRoom = ({ setGameState }) => {
  const [roomCode, setRoomCode] = useState("")
  const { joinRoomSocket,setGuessingWord ,setRoomName} = useContext(GameContext)
  const { authUser, socket } = useContext(AuthContext)
  const navigate = useNavigate()

  

 const handleJoin = async () => {

    if (!roomCode) return alert("Please enter the Room ID")
    if (!socket?.id) return alert("Socket not connected. Please try again.");
    try {
      const { data } = await axios.post(`${Backend_URL}/api/user/joinRoom`, {
        roomCode,
        socketId: authUser._id
      })
      if (!data.success) {
        return alert(data.message || "Failed to join room")
      } else {
        joinRoomSocket({ roomCode, username: authUser?.name })
        setRoomName(data.roomName);
        setGuessingWord(data.guessingWord);
        localStorage.setItem('roomCode', roomCode);
        navigate("/joinRoom")
      }
    } catch (err) {
      console.log(err.response);
    }
  }

  return (
    <div className='privateRoom-container'>
      <div className='heading'>
        <span><FaLock /> Join Room</span>
        <span><ImCross onClick={() => setGameState("")} style={{ cursor: 'pointer' }} /></span>
      </div>
      <div className='containerTwo'>
        <input type='text' placeholder='Enter Room ID' value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <button className='join' onClick={handleJoin}>Join</button>
      </div>
    </div>
  )
}
export default PrivateRoom