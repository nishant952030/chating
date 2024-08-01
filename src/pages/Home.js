import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setToken, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';

const Home = () => {
  const user = useSelector(state => state.user)
  const dipatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation();
  console.log(" form home location", location)
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;

      const response = await axios({
        url: URL,
        withCredentials: true
      })
      console.log('current user response: ', response)

      dipatch(setUser({
        _id: response.data.data._id,
        email: response.data.data.email,
        name: response.data.data.name,
        profile_pic: response.data.data.profile_pic
      }))
      console.log('home redux user', user)

      if (response.data.logout) {
        dipatch(logout())
        navigate('/email')

      }
      console.log("current user details :", response.data)
    }
    catch (error) {
      console.log("this  is the error from the home component", error)
    }
  }
  useEffect(() => {
    fetchUserDetails()
  }, [])
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className='bg-white'><Sidebar /></section>

      {location.pathname !== '/' && < section > <Outlet /></section>}
      
      {location.pathname === '/' && <div className='lg:flex justify-center items-center flex-col hidden'>
        <div>
          <img className=''
            src={logo}
            alt='logo'
            width={200}></img>
        </div>
        <p className='ml-20 -mt-3'>Select user for chetting</p>
      </div>}
    </div >)
}

export default Home