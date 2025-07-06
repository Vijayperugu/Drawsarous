import { useState } from 'react';
import google from '../assets/google.svg'
import facbook from '../assets/facebook.svg'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const SignUp = () => {
    const backendUrl = "http://localhost:8000"
    const navigate = useNavigate('')
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = async (event) => {
       try {
         event.preventDefault();
        setErrorMessage('');
        const response =  await axios.post(backendUrl + "/user/register",{
            name,email,password
        });
        if (response.data.success) {
            navigate('/home');
        } else {
            setErrorMessage(
            error.response?.data?.message || "Server error. Please try again."
        );
        }

        
       } catch (error) {
            console.log(error)
       }
    }
    return (
        <div className='body-container'>
            <div className="card">
                <div className="hero">
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>Drawsarous</h2>
                    <h3>Create new account</h3>
                    <div className="socials">
                        <button className="social-btn">
                            <img src={google} alt="" />
                            <p><span className="extra-text">SignUp with</span> Google</p>
                        </button>
                        <button className="social-btn">
                            <img src={facbook} />
                            <p><span className="extra-text">SignUp with</span> Facebook</p>
                        </button>
                    </div>
                    <span className="or"></span>
                    <input type="text"
                        placeholder='UserName'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <input type="email"
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
                    <button type="submit">Sign Up</button>
                    <p className='signup-link'>
                        Already have an account? <Link to='/login' className='highlight'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp