import React from 'react'
import { FaLock } from "react-icons/fa";
import '../styles/CreateRoom.css'
import { ImCross } from "react-icons/im";


const CreateRoom = ({setGameState}) => {
  return (
    <div className="create-container">
      <div className='heading'>
        <span><FaLock style={{ marginRight: '5px' }} />Create Room</span>
        <span><ImCross onClick={()=>setGameState("")} style={{cursor:'pointer'}}/></span>
      </div>
      <div className='containerTwo'>
        <input type='text' placeholder='Enter Room Name'></input>
        <input type='number' placeholder='Enter No of Player'></input>
        <button className='create'>Create</button>
      </div>
      
    </div>
  )
}

export default CreateRoom