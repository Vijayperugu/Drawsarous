import React, { useContext } from 'react'
import { FaLock } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import axios from 'axios'
import { GameContext } from "../../context/GameContext.jsx"
import '../styles/CreateRoom.css'
import { AuthContext } from '../../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
const Backend_URL = import.meta.env.VITE_BACKEND_URL;

const CreateRoom = ({ setGameState }) => {
  const { joinRoomSocket,setRoomName,setRoomCode,setGuessingWord } = useContext(GameContext)
  const { authUser, socket } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!socket?.id) return alert("Socket not connected. Please try again.");
    try {
      const response = await axios.post(`${Backend_URL}/api/user/createRoom`, {
        socketId: authUser._id
      })
      const { roomCode, roomName, guessingWord } = response.data
      joinRoomSocket({ roomCode, username: authUser.name, })
      localStorage.setItem('hostName', authUser.name);
      setRoomCode(roomCode);
      setRoomName(roomName);
      setGuessingWord(guessingWord);
      navigate('/createroom')
    } catch (err) {
      alert("Error creating room")
    }
  }

  return (
    <div className="create-container">
      <div className='heading'>
        <span><FaLock /> Create Room</span>
        <span><ImCross onClick={() => setGameState("")} style={{ cursor: 'pointer' }} /></span>
      </div>
      <div className='containerTwo'>
        <button className='create' onClick={handleCreate}>Create</button>
      </div>
    </div>
  )
}

export default CreateRoom