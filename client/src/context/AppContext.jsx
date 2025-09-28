import { createContext, useEffect } from "react";
import { useState } from "react";
import {toast} from "react-toastify";
import axios from 'axios';

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user,setUser]=useState(null);
    const [showLogin,setShowLogin]=useState(false);

    const [token,setToken]=useState(localStorage.getItem('token'));

    const [credit,setCredit]=useState(false)
    const backendurl = import.meta.env.VITE_BACKEND_URL

    const loadCreditsData = async()=>{
        try {
            const {data}= await axios.post('http://localhost:5001'+'/api/user/credits', {headers: {token : localStorage.getItem('token')}})
            if(data.status){
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error) 
            toast.error(error.message)
        }
    }

    const logout=()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if(token){
            loadCreditsData()
        }
    },[token])

    const value={
        user,setUser,showLogin,setShowLogin, backendurl,
        token,setToken,credit,setCredit,loadCreditsData,logout
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider