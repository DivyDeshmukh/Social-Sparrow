import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import appwriteService from "../appwrite/config";
import { login } from "../store/authSlice";
import Confirm from "./Confirm";
import config from "../config/config";

function EditProfile({ back, handleProfileSrc, handleCoverSrc }) {
  const userData = useSelector((state) => state.auth.userData);
  const { register, handleSubmit, control, getValues } = useForm();
  const [coverSrc, setCoverSrc] = useState("");
  const [coverImageFileId, setCoverImageFileId] = useState(
    userData?.user_coverImage_id
  );
  const [profileSrc, setProfileSrc] = useState("");
  const [profileImageFileId, setProfileImageFileId] = useState(
    userData?.user_profile_id
  );
  const [dob, setDob] = useState("");
  const coverRef = useRef(null);
  const avatarRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const saveRef = useRef(null);
  const dispatch = useDispatch();

  const confirm = async () => {
    setShowConfirmModal(true);
  };

  const cancel = () => {
    setShowConfirmModal(false);
  };

  const removeCoverImage = async () => {
    try {
      const deleted = await appwriteService.deleteCoverImageFile(
        coverImageFileId
      );
      if (deleted) {
        setCoverSrc("");
        setCoverImageFileId("");
      }
    } catch (error) {
      throw error;
    }
  };

  const uploadCoverImage = () => {
    coverRef?.current.click();
  };

  const handleCoverImage = async (e) => {
    if (coverSrc) {
      const deleted = await appwriteService.deleteCoverImageFile(
        coverImageFileId
      );
      console.log(deleted);
      if (!deleted) {
        return;
      }
    }

    const file = e.target.files[0];

    try {
      const uploaded = await appwriteService.uploadCoverImage(file);
      if (uploaded) {
        const preview = await appwriteService.getCoverImage(uploaded.$id);
        setCoverImageFileId(uploaded.$id);
        if (preview) {
          setCoverSrc(preview);
          console.log(preview);
          handleCoverSrc(preview);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const removeProfileImage = async () => {
    try {
      const deleted = await appwriteService.deleteProfileImage(
        profileImageFileId
      );
      if (deleted) {
        setProfileSrc("");
        setProfileImageFileId("");
      }
    } catch (error) {
      throw error;
    }
  };

  const uploadProfileImage = () => {
    avatarRef?.current.click();
  };

  const handleProfileImage = async (e) => {
    // here, we just want that if profileImageFileId is same as default profile id then do not delete.
    console.log(profileImageFileId, config.appwrite_default_profile_Id);
    if (profileImageFileId !== config.appwrite_default_profile_Id) {
      const deleted = await appwriteService.deleteProfileImage(
        profileImageFileId ? profileImageFileId : null
      );
      console.log(deleted, profileSrc);
      if (!deleted) {
        return;
      }
    }

    const file = e.target.files[0];

    try {
      const uploaded = await appwriteService.uploadProfileImage(file);
      if (uploaded) {
        const preview = await appwriteService.getProfileImage(uploaded.$id);
        setProfileImageFileId(uploaded.$id);
        if (preview) {
          setProfileSrc(preview);
          console.log(preview.href);
          handleProfileSrc(preview.href);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const saveData = () => {
    saveRef?.current.click();
    console.log(userData);
  };

  const updateData = async (data) => {
    data.user_coverImage_id = coverImageFileId;
    data.user_profile_id = profileImageFileId;
    console.log(data);

    try {
      const updateUserProfile = await appwriteService.updateUserProfile({
        userId: userData.$id,
        ...data,
      });
      if (updateUserProfile) {
        dispatch(login({ ...updateUserProfile }));
      }
      back();
    } catch (error) {
      throw error;
    }
  };

  const getImages = async () => {
    try {
      if (userData?.user_profile_id) {
        const profileImage = await appwriteService.getProfileImage(
          userData?.user_profile_id
        );
        setProfileSrc(profileImage);
      }

      if (userData?.user_coverImage_id) {
        const coverImage = await appwriteService.getCoverImage(
          userData?.user_coverImage_id
        );
        setCoverSrc(coverImage);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // console.log(coverSrc, userData, userData?.user_coverImage_id, profileSrc);
  }, [coverSrc, userData, profileSrc]);

  useEffect(() => {
    getImages();
    // console.log(userData);
  }, [userData]);

  return (
    <div className="flex justify-center items-center max-h-screen max-w-screen overflow-hidden">
      <div className="absolute z-10 h-screen bg-[#ED729F] dark:bg-[#242D34] opacity-[0.8] flex justify-center items-center w-full top-0 left-0"></div>

      {showConfirmModal ? (
        <Confirm back={back} cancel={cancel} />
      ) : (
        <div className="bg-black z-20 h-[70%] min-w-[350px] w-[60%] max-w-[600px] lg:left-[20%] xl:left-[30%] md:translate-x-4 overflow-y-auto fixed top-[15%] pt-2 -translate-y-1 rounded-2xl">
          <div
            id="top"
            className="flex justify-between items-center h-[40px] p-2 px-6 pt-4"
          >
            <div id="part1" className="flex gap-4 items-center">
              <button onClick={confirm}>
                <i className="ri-close-large-line text-white"></i>
              </button>
              <h1 className="font-semibold mb-0.5">Edit Profile</h1>
            </div>
            <button
              className="bg-white text-black font-semibold p-1 px-4 rounded-full"
              onClick={saveData}
            >
              Save
            </button>
          </div>
          <div
            id="image"
            className="w-full h-[220px] bg-black overflow-hidden mt-4 relative"
          >
            <div id="coverImage" className="h-full w-full">
              {/* upload file and the use url in coverSrc */}
              <Input
                type="file"
                className="hidden"
                ref={coverRef}
                // value={coverSrc}
                onChange={handleCoverImage}
                accept="image/*"
              />
              {coverSrc && (
                <img
                  src={coverSrc && coverSrc}
                  alt=""
                  className={`${
                    coverSrc ? "h-full w-full object-contain" : "hidden"
                  }`}
                />
              )}
              <div
                id="icons"
                className={`absolute top-[40%] ${
                  coverSrc ? "left-[42.5%]" : "left-[50%]"
                } -translate-x-1 -translate-y-1 flex gap-8`}
              >
                <button
                  className="hover:bg-slate-900 px-3 rounded-full p-2 bg-[#323638]"
                  onClick={uploadCoverImage}
                >
                  <i className="ri-image-edit-line text-white"></i>
                </button>

                {coverSrc.length !== 0 && (
                  <button
                    className="hover:bg-slate-900 bg-[#323638] px-3 p-2 rounded-full"
                    onClick={removeCoverImage}
                  >
                    <i className="ri-close-fill text-white"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div
            id="profileImage"
            className="absolute z-10 top-52 left-8 h-[100px] w-auto bg-black p-1 rounded-full"
          >
            <Input
              type="file"
              className="hidden"
              ref={avatarRef}
              onChange={handleProfileImage}
              accept="image/*"
            />
            {profileSrc && (
              <img
                src={profileSrc}
                alt=""
                className="h-full w-full object-cover rounded-full"
              />
            )}
            <button
              className="hover:bg-slate-900 rounded-full p-2 absolute top-[30%] left-[30%] translate-x-1 opacity-[0.75] bg-slate-800 px-3"
              onClick={uploadProfileImage}
            >
              <i className="ri-image-edit-line text-white"></i>
            </button>
          </div>

          <div id="text">
            <form
              onSubmit={handleSubmit(updateData)}
              className="mt-12 h-auto flex flex-col justify-center mx-10 gap-6 mb-12"
            >
              <div
                id="nameBlock"
                className="h-fit overflow-hidden rounded-md border-2 border-slate-600"
                onFocus={(e) => {
                  e.currentTarget.style.outline = "2px solid #1D9BF0";
                  e.currentTarget.style.border = "none";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.border = "2px solid rgb(71, 85, 105)";
                }}
              >
                <label
                  htmlFor="name"
                  className="text-[11px] ml-2 text-white dark:text-slate-600"
                >
                  Name
                </label>
                <Input
                  id="name"
                  className="ml-[-45px] h-[23px] bg-black focus:outline-none focus:bg-none text-white mb-1 pl-4"
                  {...register("name", {
                    required: true,
                    validate: true,
                  })}
                  defaultValue={userData?.name}
                />
              </div>
              <div
                id="bioBlock"
                className="h-fit overflow-hidden rounded-md border-2 border-slate-600"
                onFocus={(e) => {
                  e.currentTarget.style.outline = "2px solid #1D9BF0";
                  e.currentTarget.style.border = "none";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.border = "2px solid rgb(71, 85, 105)";
                }}
              >
                <label
                  htmlFor="bio"
                  className="text-[11px] ml-2 text-white dark:text-slate-600"
                >
                  Bio
                </label>
                <Input
                  id="bio"
                  className="ml-[-45px] h-[23px] bg-black focus:outline-none focus:bg-none text-white mb-1 pl-4"
                  {...register("bio", {
                    required: false,
                  })}
                  defaultValue={userData?.bio}
                />
              </div>
              <div
                id="websiteBlock"
                className="h-fit overflow-hidden rounded-md border-2 border-slate-600"
                onFocus={(e) => {
                  e.currentTarget.style.outline = "2px solid #1D9BF0";
                  e.currentTarget.style.border = "none";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.border = "2px solid rgb(71, 85, 105)";
                }}
              >
                <label
                  htmlFor="website"
                  className="text-[11px] ml-2 text-white dark:text-slate-600"
                >
                  Website
                </label>
                <Input
                  type="url"
                  id="website"
                  className="ml-[-45px] h-[23px] bg-black focus:outline-none focus:bg-none text-white mb-1 pl-4"
                  {...register("website", {})}
                  defaultValue={userData?.website}
                />
              </div>
              <div
                id="dateBlock"
                className="h-fit overflow-hidden rounded-md border-2 border-slate-600 flex items-start flex-col gap-1"
                onFocus={(e) => {
                  e.currentTarget.style.outline = "2px solid #1D9BF0";
                  e.currentTarget.style.border = "none";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.border = "2px solid rgb(71, 85, 105)";
                }}
              >
                <label
                  htmlFor="date"
                  className="text-[12px] ml-2 text-white dark:text-slate-600"
                >
                  Birth Date
                </label>
                {/* <Controller 
                                name={name || "date"}
                                control={control}
                                render={({field: {onChange}}) => (
                                    <DatePicker
                                    id="date"
                                    className='ml-[8.5px] h-[28px] bg-black focus:outline-none focus:bg-none text-white mb-1'
                                    selected={dob ? dob : new Date()}
                                    onChange={(date) => setDob(date)}
                                    showFullMonthYearPicker
                                    
                                    />
                                )}
                                /> */}
                <Input
                  type="date"
                  id="date"
                  className="h-[28px] w-fit bg-slate-800 focus:outline-none focus:bg-none text-white mb-1 ml-[8px]"
                  // value={dob ? dob : new Date().toISOString().split('T')[0]} // Ensure value is a valid ISO date string
                  // onChange={(e) => setDob(new Date(e.target.value))} // Convert string value to date object
                  {...register("date", {
                    validate: true,
                  })}
                  defaultValue={userData ? userData?.date : new Date()}
                />
              </div>

              <button type="submit" className="hidden" ref={saveRef}></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;

// create form that takes all the input required from edit profile except images
// add avatar and coverImages properties data coming from form and then update it on server
// handle images seperately

// The reason you're not getting the file object when using e.target.value in the onChange event handler of a file input (<Input type='file'>) is because the value of a file input is not the file itself, but rather the file's path, which is a security limitation imposed by browsers.

// To access the selected file(s) using React Hook Form and a file input, you should utilize the onChange event to access the FileList object containing the selected file(s).

// Now, think about that if user uploads another image then first delete prvious one from server and then update it.
