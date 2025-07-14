import React, { useEffect, useState, useContext } from 'react'
import '../styles/Chat.css'
import { GameContext } from '../../context/GameContext';
import { AuthContext } from '../../context/AuthContext.jsx';
import profilrPic from '../assets/Profile.png'

const Chat = () => {
  const { sendMessage, roomCode, socket , historyMessages , setHistoryMessages } = useContext(GameContext);
  const { authUser } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState("");
  // const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      sendMessage({ roomCode, message: messageInput, username: authUser.name });
      // setMessages((prevMessages) => [...prevMessages, { message: messageInput, username: authUser.name }]);
      setMessageInput("");
    }
  };
  useEffect(() => {
    const handleReceiveMessage = ({ message, username }) => {
      setHistoryMessages((prevMessages) => [...prevMessages, { message, username }]);
    };

    if (roomCode) {
      if (socket) {
        socket.on('receive-message', handleReceiveMessage);
      } else {
        console.error("Socket is not connected");
      }
    }

    return () => {
      if (socket) {
        socket.off('receive-message', handleReceiveMessage);
      }
    };
  }, [roomCode,socket,setHistoryMessages]);


  return (
    <div className='chat-container'>
      <div className="chat-interface">
        <div className="chat-messages">
          {historyMessages.map((msg, index) => (
            msg.username === authUser.name ? (
              <div key={index} className='ownerMessage-container'>
                <div className="ownerchat-element">
                  <div className='ownerchat-message-content'>
                    <span className='chat-username'>Me</span>
                    <p className='owner-chat-text'>{msg.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={index} className='chatMessage-container'>
                <div className='chat-message'>
                  <div className="chat-element">
                    <div className='user-avatar-container'>
                      <img
                        className="user-avatar"
                        src={profilrPic}
                        alt=""
                      />
                    </div>
                    <div className='chat-message-content'>
                      <span className='chat-username'>{msg.username}</span>
                      <p className='chat-text'>{msg.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className='chat-box'>
          <form onSubmit={handleSendMessage}>
            <input
            type='text'
            placeholder='Type your message here...'
            className='chat-input'
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)} />
          <button className='send-button' type='submit'>Send</button>
          </form>
        </div>
      </div>

    </div>
  )
}
export default Chat