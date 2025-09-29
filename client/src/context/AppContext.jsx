import { createContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import axios from 'axios';

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user,setUser]=useState(null);
    const [showLogin,setShowLogin]=useState(false);

    const [token,setToken]=useState(localStorage.getItem('token'));

    const [credit,setCredit]=useState(false)
    const backendurl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const loadCreditsData = async(token)=>{
        try {
            const {data}= await axios.post('https://ai-image-generator-saa-s-c4in.vercel.app'+'/api/user/credits',{}, {headers: {token}})
            if(data.status){
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error) 
            toast.error(error.message)
        }
    }

    const generateImage=async(prompt)=>{
        try {
           const {data} = await axios.post('https://ai-image-generator-saas-1.onrender.com'+'/api/image/generate',{prompt},{headers:{token}})
           if(data.success){
               loadCreditsData(token)
               return data.image
            }else{
                toast.error(data.message)
                loadCreditsData(token)
                if(data.creditBalance === 0){
                    navigate('/buy')
            }
        } }catch (error) {
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
            loadCreditsData(token)
        }
    },[token])

    const value={
        user,setUser,showLogin,setShowLogin, backendurl,
        token,setToken,credit,setCredit,loadCreditsData,logout,generateImage
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider