import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

export default function AuthUser() {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = Cookies.get('token')
        let userToken = false
        if (tokenString) userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () => {
        const userString = Cookies.get('user');
        let user_detail = false
        if (userString) user_detail = JSON.parse(userString);
        return user_detail
    }



    const [token, setToken] = useState(getToken(false));
    const [user, setUser] = useState(getUser(false));

    const saveToken = (user, token) => {
        Cookies.set('token', JSON.stringify(token));
        Cookies.set('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
        navigate('/dashboard');
    }

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        http.post('/api/auth/logout')
        navigate('/');
    }

    const http = axios.create({
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    http.interceptors.response.use(
        response => {
            // Jika tidak ada error, langsung teruskan response
            return response;
        },
        async error => {
            const originalRequest = error.config;
            // Periksa apakah permintaan sudah diulang
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;  // Tandai permintaan ini sudah diulang

                // Misalnya mendapatkan token baru
                try {
                    // const refreshedToken = await refreshToken();
                    const res = await http.post('/api/auth/refresh');
                    // Set token baru ke header Authorization
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                    Cookies.set('token', JSON.stringify(res.data.access_token));
                    setToken(res.data.access_token)



                    // Kirim ulang permintaan dengan header yang sudah diperbarui
                    return http(originalRequest);
                } catch (refreshError) {
                    // Jika refresh token gagal, handle error di sini
                    return Promise.reject(refreshError);
                }
            }
            // Jika kondisi tidak terpenuhi, tolak promise dengan error
            return Promise.reject(error);
        }
    );

    // Fungsi untuk mendapatkan token baru
    // async function refreshToken() {
    //     // Logika untuk mendapatkan token baru
    //     // Contoh sederhana:
    //     const response = await http.post('/api/auth/refresh', { /* data yang diperlukan */ });
    //     Cookies.set('token', JSON.stringify(response.data.acces_token))
    //     return response.data.acces_token;
    // }

    // async function refreshToken() {
    //     try {
    //         const res = await http.post('/api/auth/refresh');
    //         const token = res.data.access_token
    //         Cookies.set('token', JSON.stringify(token))
    //         setToken(token)
    //         return token


    //     } catch (error) {
    //         console.error('Error refreshing token:', error);
    //         logout();
    //     }
    // }


    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}