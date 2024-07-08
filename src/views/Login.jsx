import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button, Input, Chip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import AuthUser from "../utils/AuthUser"
import { useNavigate } from "react-router-dom"



function Login() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const { http, setToken, token } = AuthUser()
    const [isLoading, setIsLoading] = useState(false)
    const [galat, setGalat] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        document.title = "Halaman Login"
        if (token) {
            navigate('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const handleLogin = async () => {
        setIsLoading(true)
        setGalat(null)
        http.post('/api/auth/login', { email: email, password: password })
            .then((res) => {
                setToken(res.data.user, res.data.access_token);
                setIsLoading(false)
            })
            .catch(error => {
                console.error(error)
                setIsLoading(false)
                setGalat('Gagal Login')
            });
    }
    return (
        <div className='min-h-screen flex items-center px-2' >
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>

            <Card className='mx-auto w-full max-w-sm shadow-md shadow-violet-700/40'>

                <CardHeader className="flex justify-between items-start"> <h1 className="font-black text-2xl">Login</h1>
                    {galat && <Chip color='primary'>{galat}</Chip>}
                </CardHeader>
                <CardBody className='flex items-center gap-3'>
                    <Input variant="underlined" type="email" onValueChange={setEmail} label="Email" />
                    <Input variant="underlined" type="password" onValueChange={setPassword} label="Password" />
                </CardBody>
                <CardFooter>

                    <Button color='primary' variant="shadow" onClick={handleLogin} isLoading={isLoading}>Login</Button>


                </CardFooter>
            </Card>
        </div >
    )
}

export default Login