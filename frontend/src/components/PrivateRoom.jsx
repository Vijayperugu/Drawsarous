import React, { useContext, useState } from 'react'
import { FaLock } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import axios from 'axios'
import { GameContext } from '../../context/GameContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import "../styles/PrivateRoom.css"

const PrivateRoom = ({ setGameState }) => {
  const [roomCode, setRoomCode] = useState("")
  const { joinRoomSocket } = useContext(GameContext)
  const { authUser, socket } = useContext(AuthContext)
  const navigate = useNavigate()

 const handleJoin = async () => {
    if (!roomCode) return alert("Please enter the Room ID")
    if (!socket?.id) return alert("Socket not connected. Please try again.");
    try {
      await axios.post("http://localhost:8000/api/user/joinRoom", {
        roomCode,
        socketId: socket.id
      })
      joinRoomSocket({ roomCode, username: authUser?.name })
      navigate("/joinRoom")
    } catch (err) {
      console.log(err.response);
      if (err.response && err.response.data && err.response.data.msg) {
        alert(err.response.data.msg)
      } else {
        alert("Room not found or error joining")
      }
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