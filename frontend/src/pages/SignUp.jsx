import { useState } from 'react';
import google from '../assets/google.svg'
import facbook from '../assets/facebook.svg'
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    return (
        <div className='body-container'>
            <div className="card">
                <div className="hero">
                </div>
                <form>
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
                    onChange={(e)=>setName(e.target.value)} />
                    <input type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    <input type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                    <p className='signup-link'>
                        Already have an account? <Link to='/login' className='highlight'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp