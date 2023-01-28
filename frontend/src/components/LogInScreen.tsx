import axios from "axios"
import React, { ChangeEvent, FormEvent, MouseEventHandler } from "react"
import { getCookie } from "typescript-cookie"
import { logIn } from "../redux/auth"
import store from "../redux/store"
import InputField from "./InputField"
import { Screens } from "./LoggedOutScreen"

// const baseUrl = 'https://hoard-api.onrender.com'
const baseUrl = "http://localhost:4269"
export default function LogInScreen(props:any) {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    })

    function handleChange(event:ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        setFormData((previousFormData) => {
            return {
                ...previousFormData,
                [name]: value
            }
        })
    }
    
    const handleLogin = async (event:FormEvent) => {
        event.preventDefault()
        
        const {...userData} = formData
        fetch(`${baseUrl}/db/login`, {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Origin': "https://hoard.fyi"
              },
            credentials: 'include',
            body: JSON.stringify(userData) // body data type must match "Content-Type" header
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                const sessionCookie = getCookie('session')
                if (sessionCookie) {
                    store.dispatch(logIn(sessionCookie))
                }
            }
        })
    }

    function handleCreateAccount(event:React.MouseEvent<HTMLButtonElement>) {
        props.setScreen(Screens.CREATE_ACCOUNT)
    }

    return (
    <div className ="w-1/2 bg-cyan-300 p-8">
        <div className="flex justify-center">
            <label className="text-4xl">Log In</label>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-8">
            <InputField 
                name='email' 
                label="Email"
                placeholder='Email...' 
                errorMessage=""
                type='email' 
                required={true}
                onChange={handleChange} 
                value={formData.email} 
            />
            <InputField 
                name='password' 
                label="Password"
                placeholder='Password...' 
                errorMessage=""
                type='password' 
                required={true}
                onChange={handleChange} 
                value={formData.password} 
            />
            <button>Log In</button>
        </form>
        <button onClick={handleCreateAccount}>Create Account</button>
    </div>
    )
}