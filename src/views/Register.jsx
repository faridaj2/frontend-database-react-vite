import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button, Input } from "@nextui-org/react";
import axios from 'axios';
import AuthUser from '../utils/AuthUser';
import { useNavigate } from "react-router-dom"

function Register() {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const navigate = useNavigate()

    const { token } = AuthUser()

    useEffect(() => {
        if (token) {
            navigate('/dashboard')
        }
    })

    const handleregister = () => {
        if (password !== confirmPassword) {
            console.log('Password tidak sama')
            return
        }

        const data = {
            name: username,
            email: email,
            password: password
        }
        axios.post('/api/auth/register', data)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }


    return (
        <div className='min-h-screen flex items-center'>
            <Card className='mx-auto w-full max-w-sm'>
                <CardHeader>Register</CardHeader>
                <CardBody className='flex items-center gap-3'>
                    <Input type="text" onValueChange={setUsername} label="Username" />
                    <Input type="email" onValueChange={setEmail} label="Email" />
                    <Input type="password" onValueChange={setPassword} label="Password" />
                    <Input type="confirmPassword" onValueChange={setConfirmPassword} label="Confirm Password" />
                </CardBody>
                <CardFooter>
                    <Button color='primary' onClick={handleregister}>Daftar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register