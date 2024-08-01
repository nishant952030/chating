import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    token: null,
    onlineUser: [],
    socketConnection: null
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
        
        logout: () => initialState,
        setOnlineUser: (state, action) => {
            state.onlineUser=action.payload
        },
        setSocketConnection: (state, action)=>{
            state.socketConnection=action.payload
        }
    }
});

export const { setUser, setToken, logout ,setOnlineUser,setSocketConnection} = userSlice.actions;
export default userSlice.reducer;