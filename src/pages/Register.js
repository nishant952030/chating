import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helprs/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast'

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    });
    const [photo, setPhoto] = useState("");
    const navigate=useNavigate()

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        const uploadPhoto = await uploadFile(file)
        console.log(uploadPhoto);
        setPhoto(file);
        setData((prev) => {
            return {...prev,profile_pic:uploadPhoto?.url}
        })
    };

    const handleCross = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setPhoto("");
    };

    const handleSumit = async(e) => {
        e.preventDefault();
        e.stopPropagation();
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
        console.log(URL)
        try {
            const response = await axios.post(URL, data)
            console.log("response: ", response)
            toast.success(response.data.message)
            if (response.data.message) {
                setData({
                    name: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                })
                navigate('/email')
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
        console.log(data);
    };

    return (
        <div className='mt-5 flex justify-center'>
            <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden p-4'>
                <h3 className='text-center'>Welcome to Chetting place</h3>
                <form onSubmit={handleSumit} className='grid gap-4 mt-2'>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder='Enter Name' required
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.name} onChange={handleOnChange} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" placeholder='Enter Email' required
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.email} onChange={handleOnChange} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder='Enter password' required
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.password} onChange={handleOnChange} />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="profile_pic">
                            Photo:
                            <div className='h-14 bg-slate-200 flex justify-center items-center border hover:border-primary text-sm rounded cursor-pointer'>
                                <p className='text-sm max-w-[200px] line-ellipse line-clamp-1 '>
                                    {photo.name ? photo.name : "Add profile photo"}
                                </p>
                                {photo.name && <button className='text-lg ml-2 hover:text-red-600' onClick={handleCross}><IoClose /></button>}
                            </div>
                        </label>
                        <input type="file" id="profile_pic" name="profile_pic"
                            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden' onChange={handlePhoto} />
                    </div>

                    <button type='submit'
                        className='bg-primary text-lg px-4 py-1 hover:bg-secondary text-white rounded h-12 font-bold leading-relaxed tracking-wide'>
                        Register
                    </button>
                </form>
                <p className='text-center mt-2'>Already an user? <Link to={"/email"} className='text-secondary hover:text-primary'>Login</Link></p>
            </div>
        </div>
    );
}

export default Register;
