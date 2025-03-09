import { LOGO } from "@/lib/base";
import React from "react";
import { FaBell, FaMoon } from "react-icons/fa";

const Header = () => {
  return (
    <header className="max-w-md w-full mx-auto fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800">
      <div className="px-4 py-3 flex justify-between items-center">
        <img src="./logo.png" className="w-10 h-10" alt="" />
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-[#292a86] hover:bg-green-100 dark:hover:bg-gray-700 transition">
            <FaBell />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
