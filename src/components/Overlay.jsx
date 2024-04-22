import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";

function Overlay({ fileId, back }) {
  const [srcObj, setSrcObj] = useState("");

  function getFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return "image";
    } else if (["mp4", "avi", "mov"].includes(extension)) {
      return "video";
    } else {
      return "";
    }
  }

  const getSrc = async () => {
    let fileData;

    try {
      if (fileId.bucket === "tweet") {
        fileData = await appwriteService.getFileData(fileId.id);
      }

      if (fileId.bucket === "profile") {
        fileData = await appwriteService.getProfileFileData(fileId.id);
      }

      if (fileId.bucket === "coverImage") {
        fileData = await appwriteService.getCoverFileData(fileId.id);
      }

      // console.log(fileData);

      if (fileData) {
        if (getFileType(fileData.name) === "image") {
          let src;
          if (fileId.bucket === "tweet") {
            src = {
              type: "image",
              src: await appwriteService.getFilePreview(fileId.id),
            };
          } else if (fileId.bucket === "profile") {
            src = {
              type: "image",
              src: await appwriteService.getProfileImage(fileId.id),
            };
          } else if (fileId.bucket === "coverImage") {
            src = {
              type: "image",
              src: await appwriteService.getCoverImage(fileId.id),
            };
          }
          setSrcObj(src);
        } else {
          const src = {
            type: "video",
            src: await appwriteService.getFileView(fileId.id),
          };
          setSrcObj(src);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getSrc();
  }, []);

  useEffect(() => {
    // console.log(srcObj, fileId.id);
  }, [srcObj, fileId]);

  return (
    <div>
      <div className="absolute z-10 h-screen bg-[#242D34] opacity-[0.8] flex justify-center items-center w-full top-0 left-0"></div>

      <button
        className="absolute z-30 right-[13vw] top-[10.5vh]"
        onClick={back}
      >
        <i className="ri-close-large-line font-extrabold"></i>
      </button>

      <div className="absolute z-30 top-[15%] left-[15%] h-[70vh] w-[70vw] bg-[#242D34]">
        {srcObj.type === "image" ? (
          <img
            src={srcObj.src}
            alt={srcObj.src}
            className="object-contain h-full w-full"
          />
        ) : (
          srcObj.type === "video" && (
            <video
              src={srcObj.src}
              className="object-contain h-full w-full"
              autoPlay
              muted
              controls
            ></video>
          )
        )}
      </div>
    </div>
  );
}

export default Overlay;
