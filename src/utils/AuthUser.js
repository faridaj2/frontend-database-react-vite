import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthUser() {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = Cookies.get('token');
        let userToken = false;
        if (tokenString) userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () => {
        const userString = Cookies.get('user');
        let user_detail = false;
        if (userString) user_detail = JSON.parse(userString);
        return user_detail;
    }

    const [token, setToken] = useState(getToken(false));
    const [user, setUser] = useState(getUser(false));

    const saveToken = (user, token) => {
        Cookies.set('token', JSON.stringify(token), { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 30 });

        setToken(token);
        setUser(user);
        navigate('/dashboard');
    }

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        http.post('/api/auth/logout');
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
            return response;
        },
        async error => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const res = await http.post('/api/auth/refresh');
                    originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                    Cookies.set('token', JSON.stringify(res.data.access_token), { expires: 7 });
                    setToken(res.data.access_token);
                    return http(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}