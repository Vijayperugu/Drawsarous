import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Room from './pages/Room'
import { AuthContext } from '../context/AuthContext'
import JoinRoom from './pages/JoinRoom'

const App = () => {
  const { authUser } = useContext(AuthContext)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} /> 
        <Route path='/createroom' element={authUser ? <Room /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/signUp' element={!authUser ? <SignUp /> : <Navigate to='/' />} />
        <Route path='/joinRoom' element={authUser ? <JoinRoom /> : <Navigate to='/login' />} />
      </Routes>
      {/* <JoinRoom /> */}
      {/* <Room/> */}
    </>
  )
}

export default App
