import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../firebase';

const Header = () => {
    
    // handleSignOut is a function that is used to sign out the user
    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            }).catch((error) => {
            // An error happened.
            });
    }
  return (
    <div className='mx-2 py-4 kanit flex items-center justify-between'>
        {/* logo */}
        <img src='https://i.ibb.co/rpxqJQB/Sol-Ruf-animated-Logo-1.png' alt='Logo' />
        {/* Sign Out button */}
        <button 
        className='bg-[#181818] bg-opacity-90 px-4 py-2 rounded-md hover:bg-[#5c5c5c] transition-all duration-200'
        onClick={handleSignOut}
        type='button'>Log out</button>
    </div>
  )
}

export default Header