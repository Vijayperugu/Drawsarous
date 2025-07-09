import JoinCanvas from "../components/JoinCanvas"
import Chat from "../components/Chat"


import "../styles/joinRoom.css"

const JoinRoom = () => {
  return (
    <div className="joinRoom-container">
      <div className="items">
        <JoinCanvas/></div>
      <div className="items">
        <Chat/>
      </div> 
    </div>
  )
}

export default JoinRoom