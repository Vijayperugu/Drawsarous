import JoinCanvas from "../components/JoinCanvas"
import Chat from "../components/Chat"
import GuessingWord from "../components/GuessingWord"


import "../styles/joinRoom.css"

const JoinRoom = () => {
  return (
    <div className="joinRoom-container">
      <div className="item"><GuessingWord/></div>

      <div className="item">
        <JoinCanvas/></div>
      <div className="item">
        <Chat/>
      </div> 
    </div>
  )
}

export default JoinRoom