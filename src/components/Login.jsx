import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/authSlice";
import appwriteService from "../appwrite/config";
import Logo from "./Logo";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const login = async (data) => {
    // console.log(data);
    try {
      const session = await authService.login({ ...data });
      if (session) {
        const id = await authService.getCurrentUser();
        const currentUser = await appwriteService.getUserDetailsById(id.$id);
        // console.log(currentUser);
        dispatch(loginAction({ ...currentUser }));
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-full bg-black flex flex-col justify-center items-center min-h-screen">
      <div className="bg-[#ED729F] dark:bg-red-500 w-[90vw] max-w-md min-w-[350px] p-4 rounded-2xl font-bold shadow-2xl shadow-[#ED729F] dark:shadow-red-500">
        <div className="w-full flex flex-col gap-2 justify-center items-center mt-4 text-black mb-4">
          <Logo className="h-16 w-16 p-1" />
          <h1 className="">Sign in to your account</h1>
          <span>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white dark:text-amber-300 underline"
            >
              Signup
            </Link>
          </span>
          {error && (
            <p className="text-white dark:text-amber-300 mt-8 text-center">
              {error}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit(login)} className="text-left">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white dark:text-amber-300 ml-5 mb-2"
            >
              Email:
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              className="form-input mt-1 block w-full rounded-md px-4"
              {...register("email", {
                required: true,
              })}
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-white dark:text-amber-300 ml-5 mb-2"
            >
              Password:
            </label>
            <Input
              id="password"
              type={!showPassword ? "password" : "text"}
              placeholder="Enter your password"
              className="form-input mt-1 block w-full rounded-md px-4"
              {...register("password", {
                required: true,
                validate: true,
              })}
            />
            <button
              className="absolute top-12 -translate-y-1/3 right-4 transform"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <i className="ri-eye-line text-black"></i>
              ) : (
                <i className="ri-eye-off-line text-black"></i>
              )}
            </button>
          </div>
          <Button
            type="submit"
            className=" text-[#ED729F] bg-white hover:bg-[#ED729F] hover:text-white hover:border-white dark:bg-black dark:text-red-500 font-bold px-4 py-2 rounded-2xl dark:hover:bg-red-500 dark:hover:text-black hover:border-4 dark:hover:border-black mb-2 w-[40%] mt-2 mx-auto"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
