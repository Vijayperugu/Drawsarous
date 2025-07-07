import google from '../assets/google.svg'
import facbook from '../assets/facebook.svg'
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useContext, useState } from 'react';
import axios from "axios"
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login,errorMessage}= useContext(AuthContext);



    const handleSubmit = async (event) => {
        event.preventDefault()
        const success = await login("login",{email,password})  
        if(success){
            navigate('/')
        }
    }

    return (
        <div className='body-container'>
            <div className="card">
                <div className="hero">
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>Drawsarous</h2>
                    <h3>Login to your account</h3>
                    <div className="socials">
                        <button className="social-btn">
                            <img src={google} alt="" />
                            <p><span className="extra-text">Login with</span> Google</p>
                        </button>
                        <button className="social-btn">
                            <img src={facbook} />
                            <p><span className="extra-text">Login with</span> Facebook</p>
                        </button>
                    </div>
                    <span className="or"></span>
                    <input type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <button type="submit">Login</button>
                    <p className='signup-link'>
                        New here? <Link to='/signUp' className='highlight'> create new Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
