import React, { useState } from "react";
import authService from "../appwrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Logo from "./Logo";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const signup = async (data) => {
    try {
      const userAccount = await authService.createAccount({ ...data });
      if (userAccount) {
        const currentUser = await authService.getCurrentUser();
        dispatch(login({ ...currentUser }));
        navigate("/username");
      }
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div className="max-w-[100vw] min-h-screen bg-black flex justify-center items-center">
      <div className="bg-[#ED729F] dark:bg-red-500 max-w-[475px] w-[90vw] md:w-[50vw] p-4 rounded-2xl font-bold shadow-2xl shadow-[#ED729F] dark:shadow-red-500">
        <div
          id="text"
          className="w-full flex flex-col gap-2 justify-center items-center mt-4 text-black mb-4"
        >
          <Logo className="h-[64px] w-[64px] p-1" />
          <h1 className="text-center">Sign in to your account</h1>
          <span>
            Already have an account?
            <Link
              to="/login"
              className="text-white dark:text-amber-300 underline"
            >
              {" "}
              Sign in
            </Link>
          </span>
          {error && (
            <p className="text-white dark:text-amber-300 mt-8 text-center">
              {error}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit(signup)} className="mt-8">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block  text-white dark:text-black ml-5 mb-2"
            >
              Name:
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="form-input mt-1 block w-full md:w-[90%] rounded-md"
              {...register("name", {
                required: true,
              })}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block  text-white dark:text-black ml-5 mb-2"
            >
              Email:
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              className="form-input mt-1 block w-full md:w-[90%] rounded-md"
              {...register("email", {
                required: true,
              })}
            />
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block  text-white dark:text-black ml-5 mb-2"
            >
              Password:
            </label>
            <Input
              id="password"
              type={!showPassword ? "password" : "text"}
              placeholder="Enter your password"
              className="form-input mt-1 block w-full md:w-[90%] rounded-md"
              {...register("password", {
                required: true,
                validate: true,
              })}
            />
            <button
              className="absolute top-[60%] right-12"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <i className="ri-eye-line text-black mr-[-16px]"></i>
              ) : (
                <i className="ri-eye-off-line text-black mr-[-16px]"></i>
              )}
            </button>
          </div>
          <Button
            type="submit"
            className="bg-[#fff] text-[#ED729F] hover:bg-[#ED729F] hover:text-white hover:border-white dark:bg-black dark:text-red-500 font-bold px-4 py-2 rounded-2xl dark:hover:bg-red-500 dark:hover:text-black hover:border-4 dark:hover:border-black mb-2 w-[60%] md:w-[60%] mt-6"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
