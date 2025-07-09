import Chat from '../components/Chat'
import '../styles/ownerRoom.css'
import GuessingWord from '../components/GuessingWord'
import CreateCanvas from '../components/CreateCanvas'

const Room = () => {
  return (
    <div className="ownerRoom-container">
      <div className="item"><GuessingWord/>

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