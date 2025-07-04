import React from 'react'
import { FaLock } from "react-icons/fa";
import "../styles/PrivateRoom.css";
import { ImCross } from "react-icons/im";

const PrivateRoom = ({setGameState}) => {
  return (
    <div className='privateRoom-container'>
      <div className='heading'>
        <span><FaLock style={{ marginRight: '5px' }} />Join Room</span>
        <span><ImCross onClick={()=>setGameState("")} style={{cursor:'pointer'}}/></span>
      </div>
      <div className='containerTwo'>
        <input type='text' placeholder='Enter Room ID'></input>
        <button className='join'>Join</button>  
      </div>
    </div>
  )
}
export default PrivateRoom;
