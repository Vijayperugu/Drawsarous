import JoinCanvas from "../components/JoinCanvas"
import Chat from "../components/Chat"
import GuessingWord from "../components/GuessingWord"


import "../styles/joinRoom.css"

const JoinRoom = () => {
  return (
    <div className="joinRoom-container">
      <div className="item"><GuessingWord/></div>

      <div className="items">
        <JoinCanvas/></div>
      <div className="items">
        <Chat/>
      </div> 
    </div>
  )
}

export default JoinRoom