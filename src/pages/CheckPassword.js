import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { PiUserCircle } from 'react-icons/pi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';
import Avatar from '../components/Avatar';

const CheckPassword = () => {
  const [data, setData] = useState({ password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
console.log("location form checkpassword",location)
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
    console.log("API URL: ", URL);
    console.log("Sending data: ", {
      userId: location.state.data._id,
      password: data.password
    });

    try {
      const response = await axios.post(
        URL,
        {
          userId: location.state.data._id,
          password: data.password
        },
        {
          withCredentials: true  // Not withCredential
        }
      );

      console.log("Response: ", response);

      if (response.data.success) {
        dispatch(setToken({token: response.data.token}));
        localStorage.setItem('token', response.data.token);
        toast.success(response.data.message);
        setData({ password: "" });
        navigate('/');
      }

      else {
        toast.error(response.data.message);
      } 
    }

    catch (error) {
      console.error("Error: ", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!location?.state?.data?.name) {
      navigate('/email');
    }
  }, [location, navigate]);

  return (
    <div className='mt-5 flex justify-center'>
      <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4'>
        <Avatar name={location.state.data.name}
          profile_pic={location.state.data.profile_pic} />
        <h3 className='text-center'>Welcome, {location?.state?.data?.name}</h3>
        <form onSubmit={handleSubmit} className='grid gap-4 mt-2'>
          <div className='flex flex-col gap-1'>
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Enter password'
              required
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
            />
          </div>

          <button
            type='submit'
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary text-white rounded h-12 font-bold leading-relaxed tracking-wide'>
            Verify Password
          </button>
        </form>
        <p className='text-center mt-2'><Link to={"/forgot-password"} className='text-secondary hover:text-primary'>Forgot password?</Link></p>
      </div>
    </div>
  );
}

export default CheckPassword;
