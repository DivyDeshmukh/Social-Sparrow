import React from 'react'
import authService from '../../appwrite/auth';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {logout} from "../../store/authSlice";

function LogoutBtn({children, className}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
      authService.logout().then(() => {
        dispatch(logout());
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


