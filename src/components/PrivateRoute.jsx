import React from 'react'
import { Navigate } from 'react-router-dom'
import AuthUser from '../utils/AuthUser'

function PrivateRoute({ roles, element, ...props }) {
    const { token, user, logout } = AuthUser()
    const El = element

    if (!token) return <Navigate to="/" />
    if (user) {
        const role = JSON.parse(user.hak)
        if (!role.includes('admin') && !role.includes(roles)) return <Navigate to="/unathorized" />
    } else {
        logout()
    }


    return <El />
}

export default PrivateRoute