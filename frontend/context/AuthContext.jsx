import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
const Backend_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    console.log("Backend URL:", Backend_URL);
    useEffect(() => {
        const init = async () => {
            if (token) {
                axios.defaults.headers.common["token"] = token;
                await checkAuth();
            } else {
                setAuthUser(null);
            }
            setLoading(false);  // done loading
        };
        init();
    }, [token]);


    const checkAuth = async () => {
        try {
            
            const { data } = await axios.get(`${Backend_URL}/api/user/check`);
            if (data.success) {
                console.log(data.user)
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setAuthUser(null);
                setToken(null);
                localStorage.removeItem("token");
            }
            console.log(error);
        }
    }
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return
        const newSocket = io(`${Backend_URL}`, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);
        // console.log(newSocket);
        // console.log(socket)

        newSocket.on('getOnlineUsers', (useId) => {
            setOnlineUser(useId);
        })

    }

    const login = async (state, Credential) => {
        try {
            const url = `${Backend_URL}/api/user/${state}`;
            console.log("url in login: ",url);
            const { data } = await axios.post(url, Credential)
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                return true

            } else {
                setErrorMessage(data.message);
                return false;
            }

        } catch (error) {
            console.log(error)

        }
    }
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"] = null;
        socket.disconnect()
        navigate("/login");

    }
    const loginAsGuest = async (username) => {
        try {
            const { data } = await axios.post(`${Backend_URL}/api/user/guest`, { username });
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                setErrorMessage('');
                return true;
            } else {
                console.error("Guest login failed:", data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const value = {
        authUser,
        onlineUser,
        socket,
        login,
        errorMessage,
        logout,
        loading,
        loginAsGuest


    }
    if (authUser) console.log("AuthUser:", authUser);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}
