import React from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import logo from '../assets/logo.png';
import "../styles/Navbar.css"
 const Navbar = ({owner}) => {
    return (
    <>
        <nav>
            <div className="brand-name">
                <span className="logo"><img className='nav-img' src={logo} alt="Not found" /></span>
                <span className='txt'>Drawsarous</span>
            </div>
            <div className="info">
                <span className="user-profile"><FaRegUserCircle /></span>
                <span className='menu'><IoMenu /></span>
            </div>
        </nav>
    </>
  )
}
export default Navbar;
