import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import logo from '../assets/logo.png'
import '../styles/Home.css'
import PrivateRoom from '../components/PrivateRoom';
import CreateRoom from '../components/CreateRoom';


function Home() {
    const [gameState, setGameState] = useState("")
    return (
        <>
            <div className='home1-container'>
                <div className='home2-container'>
                    <h1>Drawsarous</h1>
                    <img src={logo} alt="Not found" />
                </div>
                <div className='home3-container'>
                    <button onClick={() => setGameState("Create")} className='create'><FaPencil />Create</button>
                    <button onClick={() => setGameState("Join")} className='join'><FaPlus />Join</button>
                </div>
                <div className='home4-container'>
                    {
                        gameState === "Join"
                            ? <PrivateRoom setGameState={setGameState} />
                            : gameState === "Create"
                                ? <CreateRoom setGameState={setGameState} />
                                : null

                    }
                </div>


            </div>
        </>
    )
}

export default Home