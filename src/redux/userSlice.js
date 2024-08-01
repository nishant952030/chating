import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: null  // Change this to null instead of ""
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action.payload._id || "";
            state.name = action.payload.name || "";
            state.email = action.payload.email || "";
            state.profile_pic = action.payload.profile_pic || "";
        },
        setToken: (state, action) => {
            state.token = action.payload.token;
        },
        
        logout: () => initialState  // Use initialState to reset everything
    }
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;