import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import Overlay from "./Overlay";

function Media({ username }) {
  const [fileIdArr, setFileIdArr] = useState([]);
  // const [fileSrcArr, setFileSrcArr] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [src, setSrc] = useState();

  function getFileType(fileName) {
    if (fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
        return "image";
      } else if (["mp4", "avi", "mov"].includes(extension)) {
        return "video";
      } else {
        return "";
      }
    }
  }

  const getFileIdArr = async () => {
    try {
      const fileIds = await appwriteService.getAllMediaFileIds(username);
      console.log(fileIds);
      if (fileIds) {
        setFileIdArr(fileIds);
      }
    } catch (error) {
      throw error;
    }
  };

  const getFileSrcArr = async () => {
    try {
      const promises = fileIdArr?.map(async (fileId) => {
        const fileData = await appwriteService.getFileData(fileId);

        if (fileData) {
          if (getFileType(fileData.name) === "image") {
            return {
              type: "image",
              src: await appwriteService.getFilePreview(fileId),
              id: fileId,
            };
          } else {
            return {
              type: "video",
              src: await appwriteService.getFileView(fileId),
              id: fileId,
            };
          }
        }
      });

      const resolvedFileData = await Promise.all(promises);
      setFileData(resolvedFileData);

      // const srcArr = await Promise.all(promises2);
      // console.log(srcArr);
      // setFileSrcArr(srcArr);
    } catch (error) {
      throw error;
    }
  };

  const back = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    getFileIdArr();
  }, [username]);

  useEffect(() => {
    getFileSrcArr();
  }, [fileIdArr]);

  return fileData.length !== 0 ? (
    <div>
      <div className="grid grid-cols-3 grid-rows-auto px-2 pb-4">
        {fileData &&
          fileData.map((file, index) => (
            <div
              className="h-[250px] p-1 border-[1px] border-slate-600"
              key={index}
              onClick={() => {
                setShowOverlay(true);
                setSrc({
                  bucket: "tweet",
                  id: file.id,
                });
              }}
            >
              {file.type === "image" ? (
                <img
                  src={file.src}
                  alt={file.src}
                  className="h-full w-full object-contain"
                />
              ) : (
                <video
                  src={file.src}
                  alt={file.src}
                  className="h-full w-full object-contain"
                  autoPlay
                  muted
                  loop
                />
              )}
            </div>
          ))}
      </div>

      {showOverlay && <Overlay fileId={src} back={back} />}
    </div>
  ) : (
    <div className="text-center w-full text-2xl text-white dark:text-red-500 mb-4">
      <h1>No Media added</h1>
    </div>
  );
}

export default Media;

// first take the array of fileIds from appwrite
// then getFilePreview and create src of those urls here
// then apply loop on srcArr and then add img element
