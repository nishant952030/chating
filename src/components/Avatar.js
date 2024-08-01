import React from 'react'
import { PiUserCircle } from 'react-icons/pi';
import { useLoaderData, useLocation } from 'react-router-dom'

const Avatar = ( {name,profile_pic} ) => {
    console.log("from side bar location",profile_pic)
  return (
     <div className='flex justify-center'>
          {profile_pic ? (
              <img
                  src={profile_pic}
                  className='rounded-full'
                  alt='profile'
                  style={{ width: '30px' ,height:'30px'}}
              />

          ) : (
              <PiUserCircle size={30} />
          )}
      </div>
  )
}

export default Avatar