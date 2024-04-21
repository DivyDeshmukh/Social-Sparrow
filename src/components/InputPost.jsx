import React from 'react'
import InputEmoji from "react-input-emoji"
import Button from "./Button"
import { Link } from 'react-router-dom'
import Input from './Input'

function InputPost({
    link,
    profileSrc,
    text,
    setText,
    ref,
    uploadedFile,
    removePost,
    handleFileInputChange,
    ref2,
    uploadImage,
    uploadPost,
    userData
}) {

  return (
    <div id="post" className='bg-black flex justify-between h-auto border-b-2 border-slate-600'>
          <div id="left" className='w-[10%] bg-black '>
            <Link to={`/${link}`} id="img" className='h-[40px] w-[40px] flex justify-center items-center mt-2.5 ml-7'>
              <img src={profileSrc ? profileSrc : config.appwrite_default_profile_Id} alt="" 
              className='rounded-full object-cover h-full w-full'
              />
            </Link>
          </div>
          <div id="right" className='flex flex-col gap-2 w-[90%]'>
            <div id="text" className='h-full bg-black flex justify-start flex-col border-b-2 border-b-slate-600'>
              {/* <textarea 
              placeholder='What is happening?!'
              type='text'
              style={{resize: 'none'}}
              className='h-full focus:outline-none w-full bg-black mt-4 ml-4'
              /> */}

            <InputEmoji 
              // className='h-full focus:outline-none w-full bg-black mt-4 ml-4'
              height={40}
              onChange={setText}
              value={text}
              color='white'
              borderColor='black'
              theme='dark'
              placeholder='What is happening?!'
              type='text'
              background='black'
              buttonRef={ref}
            />

               {/* below block is for showing images */}
              {/* {
                ((imgSrc.length !== 0) || (videoSrc.length !== 0)) && (
                  <div className='h-[180px] w-full px-4 relative rounded-xl mb-6 overflow-x-auto gap-2'>
                    {
                      imgSrc.map((src, index) => (
                        <div id="innerBox" className={`relative ${uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"} h-full inline-block`} key={index}>
                          <img src={src} alt={src} className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1' />
                          <Button className='absolute top-2 right-2 bg-transparent hover:bg-slate-800' onClick={(e) => removePost(index)}>
                            <i className="ri-close-large-line"></i>
                          </Button>
                        </div>
                      ))
                    }

                    {
                      videoSrc.map((src, index) => (
                        <div id="innerBox" className={`relative ${uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"} h-full inline-block`} key={index}>
                          <video src={src} 
                          className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1'
                          autoPlay
                          muted
                          controls
                          />
                          <Button className='absolute top-2 right-2 bg-transparent hover:bg-slate-800' onClick={(e) => removePost(index)}>
                            <i className="ri-close-large-line"></i>
                          </Button>
                        </div>
                      ))
                    }

                  </div>
                )
                // we can apply getFilePreview in src directly and it will return url of the uploaded image
              } */}

              {
                (uploadedFile.length !== 0) && (
                  <div className='h-[180px] w-full px-4 relative rounded-xl mb-6 overflow-x-auto gap-2'>
                    {
                      uploadedFile.map((file, index) => (
                        <div id="innerBox" className={`relative ${uploadedFile.length === 1 ? "w-[100%]" : "w-[50%]"} h-full inline-block`} key={index}>
                          {
                            (file.type === 'image') ? <img src={file.src} alt={file.src} className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1' /> :  <video src={file.src} 
                            className='object-contain h-full w-full border-[1px] border-slate-300 rounded-2xl p-1'
                            autoPlay
                            muted
                            controls
                            />
                          }
                          <Button className='absolute top-2 right-2 bg-transparent hover:bg-slate-800 mix-blend-difference' onClick={(e) => removePost(index)}>
                            <i className="ri-close-large-line text-white"></i>
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                )
              }

            </div>
            <div id="editor" className='flex items-center justify-between pl-4 w-full'>
              <div id="icon" className='flex items-center justify-start h-[40px] pl-4 w-full'>
                <Input 
                type='file'
                className='hidden'
                // value={imgSrc}
                onChange={handleFileInputChange}
                ref={ref2}
                disabled={(uploadedFile.length === 4) ? true : false}
                />
                <button onClick={uploadImage}>
                  <i className="ri-image-line object-cover"></i>
                </button>
                <button ref={ref} className='ml-4'></button>
              </div>
              <div className='pr-6'>
                <Button onClick={uploadPost} 
                disabled={(text === "" && uploadedFile.length === 0) ? true : false}
                className={`${(text === "" && uploadedFile.length === 0) ? "bg-slate-600" : "bg-blue-600 text-white"}`}
                >Post</Button>
              </div>
            </div>
          </div>
    </div>
  )
}

export default InputPost

