import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    token: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            state.isLoading = false
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
            state.token = null
        },
        loading: (state) => {
            state.isLoading = true
        }
    }
})

export const { login, logout, loading } = userSlice.actions
export default userSlice.reducer