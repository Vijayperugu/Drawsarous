import React, { useState, useEffect, useRef,useContext } from 'react'
import { FaRegUserCircle } from "react-icons/fa"
import logo from '../assets/logo.png'
import "../styles/Navbar.css"
import "../styles/Dropdown.css"
import { AuthContext } from '../../context/AuthContext.jsx'

const Navbar = ({ owner }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const profileRef = useRef();
  const { authUser, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleClickOutside = (e) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target) &&
      !profileRef.current.contains(e.target)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav>
        <div className="brand-name">
          <span className="logo">
            <img className='nav-img' src={logo} alt="Not found" />
          </span>
          <span className='txt'>Drawsarous</span>
        </div>

        <div className="info">
          <span className="user-profile" ref={profileRef} onClick={toggleDropdown}>
            <FaRegUserCircle />
          </span>
        </div>

        {showDropdown && (
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <div className="dropdown-card">
              <h3>{authUser?.name || "Guest User"}</h3>
              <ul>
                <li>My Profile</li>
                <li>Settings</li>
                {authUser ? <li onClick={logout}>Log Out</li> : <li>Log In</li>}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar;
