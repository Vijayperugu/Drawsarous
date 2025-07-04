import React from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import { Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Room from './pages/Room'

const App = () => {
  return (
   <>
    <Navbar/>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signUp' element={<SignUp/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/room' element={<Room/>}/>
    </Routes>
    
   </>
  )
}

export default App