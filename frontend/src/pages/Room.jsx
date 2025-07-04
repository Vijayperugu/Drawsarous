import React from 'react'
import Canvas from '../components/Canvas'
import Navbar from '../components/Navbar'
import Chat from '../components/Chat'
import '../styles/ownerRoom.css'
import GuessingWord from '../components/GuessingWord'

const Room = () => {
  return (
    <div className="ownerRoom-container">
      <div className="item"><GuessingWord/>

      </div>
      <div className="item">
        <Canvas/></div>
      <div className="item">
        <Chat/>
      </div>
      
      
    </div>
  )
}

export default Room