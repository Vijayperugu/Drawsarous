import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Room from './pages/Room';
import { AuthContext } from '../context/AuthContext';
import JoinRoom from './pages/JoinRoom';

const ProtectedRoute = ({ children }) => {
  const { authUser } = useContext(AuthContext);
  return authUser ? children : <Navigate to="/login" />;
};

const App = () => {
  const { authUser } = useContext(AuthContext);
  console.log('Auth User:', authUser);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createroom"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joinRoom"
          element={
            <ProtectedRoute>
              <JoinRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signUp"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
