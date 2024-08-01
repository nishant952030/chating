import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helprs/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast'
const CheckMail = () => {
  const [data, setData] = useState({
    email: ""
  });
  const navigate = useNavigate()
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

 
  const handleSumit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/login`
    console.log(URL)
    try {
      const response = await axios.post(URL, data)
      toast.success(response.data.message)
      if (response.data.message) {
        setData({
          email: ""
        })
        navigate('/password', {
          state: response.data
        })
        console.log('from email page', response.data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
    console.log("from chek mail page",data);
  };

  
  return (
    <div className='mt-5 flex justify-center'>
      <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4'>
        <h3 className='text-center'>Welcome Back</h3>
        <form onSubmit={handleSumit} className='grid gap-4 mt-2'>

          <div className='flex flex-col gap-1'>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" placeholder='Enter Email' required
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email} onChange={handleOnChange} />
          </div>

          {/* <div className='flex flex-col gap-1'>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder='Enter password' required
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password} onChange={handleOnChange} />
          </div> */}

          <button type='submit'
            className='bg-primary text-lg px-4 py-1 hover:bg-secondary text-white rounded h-12 font-bold leading-relaxed tracking-wide'>
            Verify Email
          </button>
        </form>
        <p className='text-center mt-2'>New to Chetting App? <Link to={"/register"} className='text-secondary hover:text-primary'>Signup</Link></p>
      </div>
    </div>
  );
}


export default CheckMail