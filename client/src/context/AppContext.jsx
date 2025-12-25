import React, { createContext,useContext, useEffect, useState } from 'react'
export const AppContext=createContext()
import { toast } from 'react-toastify'
import axios from 'axios'
export const AppContextProvider=({children})=>{
  
  const [user,setUser]=useState(null)
  const [showLogin,setShowLogin]=useState(null)
  const [token,setToken]=useState(localStorage.getItem("token"))
  const [credit,setCredit]=useState(0)

  const backendURL=import.meta.env.VITE_BACKEND_URL
  const loadCreditData=async()=>{
    try {
      const {data}=await axios.get(backendURL+'/api/user/credits',{headers:{token}})
      if(data.success){
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
       toast.error(error.message);
    }
  }
  const logout=()=>{
    localStorage.removeItem("token")
    setToken("")
    setUser(null)
  }

  useEffect(()=>{
    if(token){
      loadCreditData();
      setShowLogin(false)
    }
  },[token])

  const value={
     user,
     setUser,
     showLogin,
     setShowLogin,
     backendURL,
     credit,
     setCredit,
     token,
     setToken,
     logout,
     loadCreditData
  }
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}
export const useAppContext=()=>{
  return useContext(AppContext)
}
