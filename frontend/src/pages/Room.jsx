import Chat from '../components/Chat'
import '../styles/ownerRoom.css'
import CreateCanvas from '../components/CreateCanvas'
import RoomCode from '../components/RoomCode'

const Room = () => {
  return (
    <div className="ownerRoom-container">
      <div className="item"><RoomCode/>

      </div>
      <div className="item">
        <CreateCanvas/></div>
      <div className="item">
        <Chat/>
      </div>
      
      
    </div>
  )
}

export default Room