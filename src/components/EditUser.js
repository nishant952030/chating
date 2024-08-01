import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import uploadFile from '../helprs/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

const EditUser = ({ onClose, data }) => {

    const user = useSelector(state => state.user);
    const token=user.token
    console.log("data from the edit props", user)
    const dispatch = useDispatch();

    const [newDetails, setNewDetails] = useState({
        name: '',
        profile_pic: ''
    });
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data) {
            setNewDetails({
                name: data.name,
                profile_pic: data.profile_pic
            });
            setNameInput(data.name);
        }
    }, [data,user]);
    const handleEditDp = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileSelect = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadPhoto = await uploadFile(file);
                setNewDetails(prev => ({ ...prev, profile_pic: uploadPhoto.url }));
                const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
                const response = await axios.post(URL,
                    { ...newDetails, profile_pic: uploadPhoto.url },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.data.success) {
                    toast.success(response.data.message)
                }
                dispatch(setUser.response.data)
                console.log("New details:", response.data);
                setNewDetails(response.data.data);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    };

    const handleNameChange = async (e) => {
        e.preventDefault();
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL,
                { ...newDetails, name: nameInput },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                
            );
            if (response.data.success) {
                toast.success(response.data.message)
            }
            setNewDetails(prev => ({ ...prev, name: nameInput }));
            setIsEditingName(false);
            console.log("New details:", response.data);
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };
    const handleclose = () => {
        onClose(); 
    }
    const viewBig = () => {
        
    }
    return (
        <div className='fixed w-full top-0 left-0 bottom-0 right-0 bg-slate-700 bg-opacity-10 backdrop-blur-sm flex justify-center items-center '>
            <div className='w-full sm:w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl rounded-lg p-4 sm:mx-6'>
                <div className='flex justify-center pt-6'>
                    <div className='flex'>
                        <img src={newDetails.profile_pic} className='rounded-full border border-gray-300' style={{ height: '120px', width: '120px' }} alt='Profile' onClick={viewBig} />
                        <FiEdit
                            size={20}
                            className=' my-auto ml-5 cursor-pointer text-gray-600'
                            style={{ opacity: '0.8', fontWeight: 'lighter' }}
                            onClick={(e)=>handleEditDp(e)}
                            title='Edit DP'
                        />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className='flex justify-center pt-6'>
                    {isEditingName ? (
                        <div className='flex items-center'>
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className='border p-2 rounded-lg'
                            />
                            <button
                                onClick={(e)=>handleNameChange(e)}
                                className='ml-4 p-2 bg-blue-500 text-white rounded-lg flex items-center'
                            >
                                <AiOutlineCheck size={20} />
                                <span className='ml-1'>Save</span>
                            </button>
                        </div>
                    ) : (
                            <div className='flex justify-around items-center'>
                            <h2 className='text-slate-700 mr-2'>Name:</h2>
                            <h2 className='text-xl bg-slate-300 rounded-md px-2'>{newDetails.name}</h2>
                            <FiEdit
                                size={20}
                                className='ml-4 cursor-pointer text-gray-600 '
                                style={{ opacity: '0.8', fontWeight: 'lighter' }}
                                onClick={() => setIsEditingName(true)}
                                title='Edit Name'
                            />
                        </div>
                    )}
                </div>
                <div className='flex justify-end'>
                    <button type='button' className='bg-slate-700 p-2 rounded-md text-slate-100 cursor-pointer hover:bg-slate-600 transition-colors duration-300 ease-in-out transform' onClick={handleclose} >Done</button>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
