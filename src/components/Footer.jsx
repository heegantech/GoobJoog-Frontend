import React from "react";
import { FaExchangeAlt, FaHome, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex justify-around items-center h-16 px-6">
        <Link
          to="/transactions"
          className={`flex flex-col items-center ${
            isActive("/transactions")
              ? "text-[#292a86]"
              : "text-[#3e3f9e] hover:text-[#292a86]"
          }`}
        >
          <div
            className={`${
              isActive("/transactions")
                ? "bg-[#292a86] rounded-full p-4 mb-1"
                : ""
            }`}
          >
            <FaExchangeAlt
              className={`${
                isActive("/transactions")
                  ? "text-white text-xl"
                  : "text-xl mb-1"
              }`}
            />
          </div>
          {!isActive("/transactions") && (
            <span className="text-xs">Transactions</span>
          )}
        </Link>
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive("/")
              ? "text-[#292a86]"
              : "text-[#3e3f9e] hover:text-[#292a86]"
          }`}
        >
          <div
            className={`${
              isActive("/") ? "bg-[#292a86] rounded-full p-4 mb-1" : ""
            }`}
          >
            <FaHome
              className={`${
                isActive("/") ? "text-white text-xl" : "text-xl mb-1"
              }`}
            />
          </div>
          {!isActive("/") && <span className="text-xs">Home</span>}
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            isActive("/profile")
              ? "text-[#292a86]"
              : "text-[#3e3f9e] hover:text-[#292a86]"
          }`}
        >
          <div
            className={`${
              isActive("/profile") ? "bg-[#292a86] rounded-full p-4 mb-1" : ""
            }`}
          >
            <FaUser
              className={`${
                isActive("/profile") ? "text-white text-xl" : "text-xl mb-1"
              }`}
            />
          </div>
          {!isActive("/profile") && <span className="text-xs">Profile</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Footer;
