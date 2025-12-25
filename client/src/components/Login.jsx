import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify';
import axios from "axios"
const Login = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [state, setState] = useState("login")

    const { setUser, setShowLogin, backendURL,token,setToken} = useAppContext()

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try {
            if(state == 'login'){
                const {data} = await axios.post(backendURL + '/api/user/login', {email, password});

                if(data.success){
                    setToken(data.token);
                    setUser(data.user);
                    
                    localStorage.setItem('token', data.token)
                    setShowLogin(false);
                }
                else{
                    toast.error(data.message);
                }
            }
            else{
                const {data} = await axios.post(backendURL + '/api/user/register', {name, email, password});

                if(data.success){
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                }
                else{
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {
                    state !== 'login' &&
                    <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.profile_icon} className='w-6' alt="" />
                        <input onChange={(e) => setName(e.target.value)} value={name} className='outline-none text-sm' type="text" placeholder='Full Name' required />
                    </div>
                }

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.email_icon} alt="" />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none text-sm' type="email" placeholder='Email ID' required />
                </div>

                <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className='outline-none text-sm' type="password" placeholder='Password' required />
                </div>

                <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forget password</p>

                {state == 'login' ?
                    <button className='bg-blue-600 w-full text-white py-2 rounded-full'>Login</button>
                    :
                    <button className='bg-blue-600 w-full text-white py-2 rounded-full'>Sign Up</button>
                }

                {
                    state == 'login' ?
                        <p className='mt-5 text-center'>Don't have an account? <span onClick={() => setState('sign up')} className='text-blue-600 cursor-pointer'>Sign Up</span></p>
                        :
                        <p className='mt-5 text-center'>Already have an account? <span onClick={() => setState('login')} className='text-blue-600 cursor-pointer'>Login</span></p>
                }

                <img src={assets.cross_icon} onClick={() => setShowLogin(false)} className='absolute top-5 right-5 cursor-pointer' alt="" />
            </form>
        </div>
    )
}

export default Login