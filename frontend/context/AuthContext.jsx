import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);
    const [errorMessage,setErrorMessage]=useState('');
    useEffect(() => {
        if (token) {
        axios.defaults.headers.common["token"] = token;
        checkAuth();
    } else {
        setAuthUser(null);
    }
    setErrorMessage("");
    },[token])

    const checkAuth = async () => {
    try {
        const { data } = await axios.get("http://localhost:8000/user/check");
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
        const newSocket = io("http://localhost:8000", {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (useId) => {
            setOnlineUser(useId);
        })

    }

    const login = async (state, Credential) => {
        try {
            const { data } = await axios.post(`http://localhost:8000/user/${state}`, Credential)
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                return true

            }else{
                setErrorMessage(data.message);
                return false;
            }

        } catch (error) {
            console.log(error)

        }
    }
    const logout = async ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"] = null;
        socket.disconnect()
    }


    const value = {
        authUser,
        onlineUser,
        socket,
        login,
        errorMessage,
        logout


    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}