import { createSlice } from "@reduxjs/toolkit";

export const flowboardSlice = createSlice({
    name: "flowboard",
    initialState: {
        user: null,
        isAuthenticated: false,
        token: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        }
    }
});

export const { loginSuccess, logout } = flowboardSlice.actions;