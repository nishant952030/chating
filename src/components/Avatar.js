import React from 'react'
import { PiUserCircle } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { useLoaderData, useLocation } from 'react-router-dom'

const Avatar = ({ userId, name, profile_pic }) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser)
    const isOnline = onlineUser.includes(userId)
    return (
        <div className='flex justify-center relative'>
            {profile_pic ? (
                <img
                    src={profile_pic}
                    className='rounded-full'
                    alt='profile'
                    style={{ width: '30px', height: '30px' }}
                />

            ) : (
                <PiUserCircle size={30} />
            )}
            {isOnline &&
                <div className='absolute bottom-0 left-5 bg-slate-200 w-3 h-3 rounded-full flex items-center justify-center'>
                    <div className='bg-green-500 p-1 w-2 h-2 rounded-full'></div></div>
            }

        </div>
    )
}

export default Avatar