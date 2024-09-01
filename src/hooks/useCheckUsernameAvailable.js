import { useDispatch, useSelector } from "react-redux";
import config from "../config/config";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import appwriteService from "../appwrite/config";

export default function useCheckUsernameAvailable () {
    const [status, setStatus] = useState("idle");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);

    const checkUsername = useCallback(async (data) => {
        setStatus('loading');
        try {
            const usernameAvailable = await appwriteService.checkUsernameAvaialable(data.username);
            if (usernameAvailable.length === 0) {
                const userProfile = await appwriteService.userProfile({
                    userId: userData.$id,
                    username: data.username,
                    user_profile_id: config.appwrite_default_profile_Id,
                    email: userData.email,
                    name: userData.name,
                });

                if (userProfile) {
                    dispatch(login({ ...userProfile }));
                    navigate("/home");
                    setStatus('success');
                }
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.log(error);
            setStatus('error');
        }
    }, [userData, dispatch, navigate]);

    return {
        checkUsername,
        status
    }
}
