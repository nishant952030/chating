import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setUser, setSocketConnection } from '../redux/userSlice';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      const userData = response.data.data;

      dispatch(setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        profile_pic: userData.profile_pic,
      }));

      if (response.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }; 

  useEffect(() => {
    fetchUserDetails();
  }, []); // Empty dependency array to ensure this runs only once on mount

  useEffect(() => {
    if (user.id && !socket) { // Check if user.id is available and socket is not already initialized
      const token = localStorage.getItem('token');
      if (token) {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
          auth: { token },
        });

        newSocket.on('connect', () => {
          console.log('Connected to socket server:', newSocket.id);
          setSocket(newSocket);
          dispatch(setSocketConnection(newSocket));
        });

        newSocket.on('onlineUser', (data) => {
          console.log('Online users data:', data);
          dispatch(setOnlineUser(data));
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from socket server');
          setSocket(null);
          dispatch(setSocketConnection(null));
        });

        return () => {
          newSocket.disconnect();
        };
      }
    }
  }, [user.id]); // Depend on user.id to ensure socket connection is established only when user data is available

  useEffect(() => {
    console.log("User state:", user);
    console.log("Socket state:", socket);
  }, [user, socket]);

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className='bg-white'><Sidebar /></section>
      {location.pathname !== '/' && <section><Outlet /></section>}
      {location.pathname === '/' && (
        <div className='lg:flex justify-center items-center flex-col hidden'>
          <div>
            <img src={logo} alt='logo' width={200} />
          </div>
          <p className='ml-20 -mt-3'>Select user for chatting</p>
        </div>
      )}
    </div>
  );
};

export default Home;
