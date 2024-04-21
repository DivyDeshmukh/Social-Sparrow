import React from 'react'
import authService from '../../appwrite/auth';
import { useNavigate } from 'react-router-dom';

function LogoutBtn({children, className}) {

    const navigate = useNavigate();

    const handleClick = () => {
        authService.logout().then(() => {
            // update store
            navigate("/");
        });
    }

  return (
    <button onClick={handleClick} className={`${className} px-3 p-2`}>
        {children}
    </button>
  )
}

export default LogoutBtn;


