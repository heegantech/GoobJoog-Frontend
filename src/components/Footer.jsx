import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiOutlineHome, HiOutlineUser, HiOutlineArrowsRightLeft } from "react-icons/hi2";

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-black shadow-xl border-t border-gray-300 dark:border-gray-700 p-2">
      <div className="flex justify-around items-center h-14 px-6">
        <Link
          to="/transactions"
          className={`flex flex-col items-center transition-all ${
            isActive("/transactions") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <HiOutlineArrowsRightLeft className="text-2xl" />
          <span className="text-xs">Transactions</span>
        </Link>
        <Link
          to="/"
          className={`flex flex-col items-center transition-all ${
            isActive("/") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <HiOutlineHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center transition-all ${
            isActive("/profile") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <HiOutlineUser className="text-2xl" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
