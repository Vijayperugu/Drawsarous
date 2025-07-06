import google from '../assets/google.svg'
import facbook from '../assets/facebook.svg'
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useState } from 'react';
import axios from "axios"


const Login = () => {
    const backendUrl = "http://localhost:8000";
    const navigate = useNavigate('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('');
        try {
            const response = await axios.post(backendUrl + "/user/login", {
                email, password
            })
            if (response.data.success) {
                navigate('/home')
            } else {
                setErrorMessage(response.data.message || "server Error")
            }
        } catch (error) {
            console.error(error);

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
