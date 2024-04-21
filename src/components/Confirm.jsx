import React from "react";

function Confirm({ back, cancel }) {
  return (
    <>
      <div className="absolute z-10 h-screen bg-[#ED729F] dark:bg-[#242D34] opacity-[0.8] flex justify-center items-center w-full top-0 left-0"></div>

      <div className="bg-black z-20 h-[40%] max-h-[240px] min-w-[250px] max-w-[300px] w-[30%] overflow-y-auto absolute top-[32.5%] translate-x-3 pt-4 -translate-y-1 rounded-2xl px-4 lg:left-[40%] lg:top-[35%]">
        <div id="text" className="flex w-[90%] flex-col gap-2 mb-6 pl-5">
          <h1 className="font-bold text-[20px]">Discard Changes?</h1>
          <p className="text-white dark:text-slate-600 text-[14px]">
            This can't be undone and you'll lose your changes
          </p>
        </div>
        <div id="btns" className="flex flex-col items-center gap-4 w-full">
          <button
            className="w-[90%] text-center rounded-full font-semibold bg-[#ED729F] text-white dark:bg-[#DC1E29] p-1 py-2"
            onClick={back}
          >
            Discard
          </button>
          <button
            className="w-[90%] text-center rounded-full font-semibold border-[1px] border-white text-white dark:border-slate-600 py-2"
            onClick={cancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default Confirm;
