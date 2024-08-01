import React from 'react'
import logo from '../assets/logo.png'
const AuthLayouts = ({ children }) => {
    return (
        <>
            <div className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
                <img
                    src={logo}
                    alt='logo'
                    width={180}
                    height={60} />
            </div>
            {
                children
            }
        </>
    )
}

export default AuthLayouts