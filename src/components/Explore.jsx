import React, { useState } from "react";
import Input from "./Input";
import Search from "./Search";

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-[65vh] flex items-start pt-6 justify-center">
      <div id="search" className="w-[40%] flex flex-col items-center">
        <nav className="flex w-full mb-8 pb-3 justify-center items-center py-1">
          <Input
            type="text"
            placeholder="🔍 Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border-2 border-red-500 px-4 w-[50vw] text-white rounded-lg"
          />
        </nav>
        <div
          id="results"
          className="w-[90%] bg-red-500 shadow-md shadow-white rounded-md min-w-[300px] max-w-[400px] max-h-[300px] overflow-y-auto"
        >
          {searchTerm && <Search username={searchTerm} />}
        </div>
      </div>
    </div>
  );
}

export default Explore;
