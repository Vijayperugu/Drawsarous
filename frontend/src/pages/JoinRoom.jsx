import React, { useState } from "react";
import JoinCanvas from "../components/JoinCanvas"
import Chat from "../components/Chat"
import GuessingWord from "../components/GuessingWord"
import { BsChatText } from "react-icons/bs";
import "../styles/JoinRoom.css"

const JoinRoom = () => {
  return (
    <div className="joinRoom-container">
      <div className="item"><GuessingWord /></div>
      <div className="item">
        <JoinCanvas /></div>
      <div className="item">
        <Chat/>
      </div>
    </div>
  )
}

export default JoinRoom