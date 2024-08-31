import React, { useState } from 'react';
import Input from './Input';
import Search from './Search';

function SearchInput() {

    const [searchTerm, setSearchTerm] = useState("");

  return (
    <div id="search" className="hidden md:block w-[25%]">
        <nav className="border-b-2 border-white  dark:border-red-500 flex w-full mb-8 pb-3 justify-between items-center py-1">
          <Input
            type="text"
            placeholder="🔍 Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900 border-2 border-white dark:border-red-500 px-4 text-white rounded-lg"
          />
        </nav>
        <div
          id="results"
          className="w-full h-auto bg-[#ED729F] dark:bg-red-500 shadow-md shadow-white rounded-md"
        >
          {searchTerm && <Search username={searchTerm} />}
        </div>
    </div>
  );
}

export default SearchInput;
