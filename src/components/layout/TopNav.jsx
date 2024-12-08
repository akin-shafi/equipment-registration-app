/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Replaced Next.js router with react-router-dom's useNavigate
import { useSession } from "@/hooks/useSession";
import AvatarImage from "@/assets/images/default_user.png";
import { SearchIcon, NotificationIcon, OpenSideNav } from "../Icon";

const TopNav = ({ onMenuClick }) => {
  const { session, logout } = useSession(); // Access logout from context
  const navigate = useNavigate(); // Use react-router-dom's navigate function
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const sideNavRef = useRef(null); // Assuming this ref is needed for detecting outside clicks

  const profilePicture = session?.user?.profilePicture; // Get profile picture from context

  // Handle logout using the logout function from context
  const handleLogout = () => {
    logout(); // Call logout to clear token and user data in localStorage and update global state
    navigate("/"); // Redirect to login page using react-router-dom
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setSideNavOpen(false);
      }
    };

    if (sideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideNavOpen]);

  return (
    <nav className="shadow text-black p-4 flex justify-between items-center h-[8vh] fixed top-0 right-0 z-50 md:w-3/4 w-screen px-4">
      <button onClick={onMenuClick} className="md:hidden p-2">
        <OpenSideNav />
      </button>
      <div className="w-1/2 h-[40px] bg-[#F0F2F5] rounded-[10px] flex items-center gap-2 px-[12px]">
        <SearchIcon />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search here..."
          className="w-full bg-transparent h-full outline-0 border-0 placeholder:text-[#667185] font-normal text-[14px]"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[25px] h-[25px] relative">
          <NotificationIcon />
          <div className="absolute top-0 right-0 w-[15px] h-[15px] rounded-full flex items-center justify-center bg-[#475367] text-white text-[9px]">
            0
          </div>
        </div>

        <div className="w-[40px] h-[40px] rounded-full">
          <img
            src={
              profilePicture && profilePicture !== "null"
                ? profilePicture
                : AvatarImage
            }
            alt="User avatar"
            className="w-full h-full rounded-full"
          />
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
