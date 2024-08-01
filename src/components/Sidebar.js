import React, { useState, useRef, useEffect } from 'react';
import { CiChat1 } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SlLogout } from "react-icons/sl";
import { FaRegUserCircle } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { CiSearch } from "react-icons/ci";
import Avatar from './Avatar';
import EditUser from './EditUser';
import { logout } from '../redux/userSlice';
import { debounce } from 'lodash';
import axios from 'axios';


const Sidebar = () => {
    const user = useSelector(state => state?.user || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [edit, setEdit] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [recent, setRecent] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);

    const handleEdit = () => {
        setEdit(!edit);
    };

    const logoutFun = () => {
        dispatch(logout());
        navigate('/email');
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => searchInputRef.current?.focus(), 500);
        } else {
            setSearchResult([]);
            setIsSearching(false);
        }
    };




    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;

    const handleSearch = debounce(async (e) => {
        const query = e.target.value.trim().toLowerCase();
        setIsSearching(query !== "");

        if (query) {
            try {
                const response = await axios.post(URL, { search: query });

                if (response.data.success) {
                    setSearchResult(response.data.data);
                    console.log(response.data.data)
                } else {
                    console.error("Error fetching search results:", response.data.message);
                    setSearchResult([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResult([]);
            }
        } else {
            setSearchResult([]);
        }
    }, 300);


        const handleUserClick = (user) => {
            console.log(`Opening chat with ${user.name}`);
            setShowSearch(false);
            setSearchResult([]);
            navigate(`${user._id}`); // Navigate to the chat route
        };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSearch && !event.target.closest('.search-container')) {
                setShowSearch(false);
                setSearchResult([]);
                setIsSearching(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearch]);


    const [isConversation, setIsconversation] = useState(true);


    const handleConversationChats = () => {
        setIsconversation(true);
    }
    const allUsersUrl = `${process.env.REACT_APP_BACKEND_URL}/api/all-friends`;
    const handleConversationFriends = async () => {
        setIsconversation(false);
        try {
            const response = await axios.get(allUsersUrl);
            if (response.data.success) {
                  console.log(response.data.data)
                response.data.data.sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });


                setAllUsers(response.data.data);
            } else {
                console.error("Error fetching users:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }

    }
    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <div className='bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between'>
                <div>
                    <button
                        className={`w-12 h-12 bg-slate-300 flex justify-center items-center rounded-tr-lg cursor-pointer transition-colors duration-300 ease-in-out transform hover:bg-slate-400 ${isConversation ? "bg-slate-400" : ""}`}
                        title='Chat'
                        onClick={handleConversationChats}
                    >
                        <CiChat1 size={38} />
                    </button>

                    <button
                        className={`w-12 h-12 bg-slate-300 flex justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out transform hover:bg-slate-400 ${!isConversation ? "bg-slate-400" : ""}`}
                        onClick={handleConversationFriends}
                        title='Friends'
                    >
                        <CiUser size={32} />
                    </button>
                </div>
                <div>
                    <button
                        className="w-12 h-12 flex justify-center items-center rounded-tr-lg cursor-pointer transition-colors duration-300 ease-in-out transform hover:bg-slate-300"
                        title='Profile'
                        onClick={handleEdit}
                    >
                        <Avatar
                            size={30}
                            userId={user?._id}
                            name={user.name || "User"}
                            profile_pic={user.profile_pic}
                        />
                    </button>
                    <button
                        className="w-12 h-12 flex justify-center items-center rounded-br-lg cursor-pointer transition-colors duration-300 ease-in-out transform hover:bg-slate-300"
                        title='Logout'
                        onClick={logoutFun}
                    >
                        <SlLogout size={26} />
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 pr-4 flex justify-between items-center bg-slate-100'>
                    <h2 className='text-xl font-bold p-4 text-slate-700'>{isConversation ? "Conversations" : "Friends"}</h2>
                    <div className="relative search-container">
                        <CiSearch
                            className='cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110'
                            size={30}
                            onClick={toggleSearch}
                        />
                        <div
                            className={`absolute right-8 top-0 -mt-1 h-10 bg-white shadow-md rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${showSearch ? 'w-48' : 'w-0'}`}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full h-full px-4 outline-none"
                                ref={searchInputRef}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    {showSearch && (isSearching || searchResult.length > 0) && (
                        <div className="bg-white absolute rounded-xl border border-slate-200 shadow-lg left-14 top-16 w-64 max-h-96 overflow-x-hidden overflow-y-auto transition-all duration-500 ease-in-out">
                            {isSearching && searchResult.length === 0 ? (
                                <div className="p-4 text-gray-500">No results found</div>
                            ) : (
                                    searchResult.map(user => (
                                        
                                        <div
                                            key={user._id}
                                            className="p-3 hover:bg-slate-100 cursor-pointer"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Avatar userId={user?._id} size={20} name={user.name} profile_pic={user.profile_pic} />
                                                <div>
                                                    <h3 className="font-semibold">{user.name}</h3>
                                                    <p className="text-xs text-gray-500">{user.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                    
                                    ))
                            )}
                        </div>
                    )}
                </div>

                <div className='w-full bg-slate-200 rounded-lg' style={{ height: '1px' }}></div>

                <div className='bg-slate-100 h-[calc(100vh-65px)] overflow-x-hidden overflow-y-scroll'>



                    {isConversation ? recent.length === 0 ? (
                        <div className='h-full w-full flex justify-center items-center'>
                            <h2>Add a friend from list!</h2>
                        </div>
                    ) : (
                        recent.map(user => (
                            <div
                                key={user._id}
                                className="p-4 hover:bg-slate-200 transition-colors duration-300 cursor-pointer"
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar size={40} userId={user?._id} name={user.name} profile_pic={user.profile_pic} />
                                    <div>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.status || "Hey there! I'm using this chat app."}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) :
                        allUsers.length === 0 ? (
                            <div className='h-full w-full flex justify-center items-center'>
                                <h2>Add a friend from list!</h2>
                            </div>
                        ) : (
                            allUsers.map(user => (
                                <div
                                    key={user._id}
                                    className="p-4 hover:bg-slate-200 transition-colors duration-300 cursor-pointer"
                                    onClick={ ()=>handleUserClick(user)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar size={40} userId={user?._id} name={user.name} profile_pic={user.profile_pic} />
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.status || "Hey there! I'm using this chat app."}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}




                </div>
            </div>

            {edit && <EditUser onClose={() => setEdit(false)} data={user} />}
        </div>
    );
};

export default Sidebar;