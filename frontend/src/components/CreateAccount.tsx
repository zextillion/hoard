import React, { ChangeEvent } from "react";
import { FormEvent } from "react";
import { dbApi } from "../redux/db";
import InputField from './InputField'
import './AccountSignIn.css'

export default function CreateAccount() {
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        userName: '',
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    // Empty string indicates no problems, otherwise there's an issue with the input
    const [formDataStatus, setFormDataStatus] = React.useState({
        userName: "",
        email: "",
        password: "",
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

    const handleSubmit = async (event:FormEvent) => {
        event.preventDefault()
        
        const {confirmPassword, ...userData} = formData

        if (formData.confirmPassword !== formData.password) {
            setFormDataStatus(previousFormDataStatus => {
                return {
                    ...previousFormDataStatus,
                    password: "Password and Confirm Password must match"
                }
            })
            return;
        }
        else {
            setFormDataStatus(previousFormDataStatus => {
                return {
                    ...previousFormDataStatus,
                    password: ""
                }
            })
        }

        console.log('fetching https://hoard-fyi.herokuapp.com/db/createUser')
        fetch('https://hoard-fyi.herokuapp.com/db/createUser', {  // Enter your IP address here
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'omit',
            body: JSON.stringify(userData) // body data type must match "Content-Type" header
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setFormDataStatus(previousFormDataStatus => {
                return {
                    ...previousFormDataStatus,
                    email: data.emailExists ? "Email taken" : "",
                    // userName: data.userNameExists ? "Username taken" : ""
                }
            })
        })
    }

    const handleLogin = async (event:FormEvent) => {
        event.preventDefault()
        
        const {confirmPassword, ...userData} = formData
        console.log('fetching https://hoard-fyi.herokuapp.com/db/login')
        fetch('https://hoard-fyi.herokuapp.com/db/login', {  // Enter your IP address here
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
            credentials: 'omit',
            body: JSON.stringify(userData) // body data type must match "Content-Type" header
        })
        .then(response => {
            console.log(response)
            return response.json()})
        .then(data => {
            console.log(data)
        })
    }


    const handleLogOut = async (event:FormEvent) => {
        event.preventDefault()
        
        const {confirmPassword, ...userData} = formData
        fetch('http://localhost:4269/db/logout?_method=DELETE', {  // Enter your IP address here
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
              },
            credentials: 'include',
            body: JSON.stringify(userData) // body data type must match "Content-Type" header
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    }

    return (
    <div className ="w-1/2 bg-cyan-300 p-8">
        <div className="flex justify-center">
            <label className="text-4xl">Signup</label>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-8">
            <InputField 
                name='displayName' 
                label="Display Name"
                placeholder='Display Name...' 
                errorMessage=""
                type='text' 
                required={false}
                onChange={handleChange} 
                value={formData.displayName} 
            />
            <InputField 
                name='email' 
                label="Email"
                placeholder='Email...' 
                errorMessage={formDataStatus.email}
                type='email' 
                required={true}
                onChange={handleChange} 
                value={formData.email} 
            />
            <InputField 
                name='password' 
                label="Password"
                placeholder='Password...' 
                errorMessage={formDataStatus.password}
                type='password' 
                required={true}
                onChange={handleChange} 
                value={formData.password} 
            />
            <InputField 
                name='confirmPassword' 
                label="Confirm Password"
                placeholder='Confirm Password...' 
                errorMessage={formDataStatus.password}
                type='password' 
                required={true}
                onChange={handleChange} 
                value={formData.confirmPassword} 
            />
            <button>Create Account</button>
        </form>
    </div>
    )
}