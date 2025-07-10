import React, { useEffect, useState, useContext } from 'react'
import '../styles/Chat.css'
import { GameContext } from '../../context/GameContext';
import { AuthContext } from '../../context/AuthContext.jsx';

const Chat = () => {
  const { sendMessage, roomCode, socket } = useContext(GameContext);
  const { authUser } = useContext(AuthContext);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      sendMessage({ roomCode, message: messageInput, username: authUser.name });
      setMessages((prevMessages) => [...prevMessages, { message: messageInput, username: authUser.name }]);
      setMessageInput("");
    }
  };
  useEffect(() => {
    const handleReceiveMessage = ({ message, username }) => {
      setMessages((prevMessages) => [...prevMessages, { message, username }]);
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
  }, [roomCode]);


  return (
    <div className='chat-container'>
      <div className="chat-interface">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            msg.username === authUser.name ? (
              <div key={index} className='ownerMessage-container'>
                <div className="ownerchat-element">
                  <div className='ownerchat-message-content'>
                    <span className='chat-username'>Me</span>
                    <p className='owner chat-text'>{msg.message}</p>
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
                        src="https://imgs.search.brave.com/bWNFz9pFC1Ul5pZ7ql6Z9qc1cTlkBrZbXMdCTkoMqeY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v..."
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
          <input
            type='text'
            placeholder='Type your message here...'
            className='chat-input'
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)} />
          <button className='send-button' onClick={handleSendMessage}>Send</button>
        </div>
      </div>

    </div>
  )
}
export default Chat