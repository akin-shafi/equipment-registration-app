/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom"; // For programmatic navigation
import TopNav from "./TopNav";
import SideNav from "./SideNav";

const DashboardLayout = ({ children }) => {
  const { session } = useSession(); // Auth state: { user, token }
  const navigate = useNavigate(); // For programmatic navigation
  const userRole = session?.user?.role;
  // const isAssessor = userRole === "assessor";
  const isAssessorOrDataEntry = userRole === "assessor" || userRole === "data-entry";


  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const toggleSideNav = () => setIsSideNavOpen((prev) => !prev);
  const closeSideNav = () => setIsSideNavOpen(false);

  // Redirect to login if session is null
  useEffect(() => {
    if (!session) {
      navigate("/login"); // Redirect to login page if session is null
    }
  }, [session, navigate]);

  // Close SideNav when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        closeSideNav();
      }
    };

    if (isSideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideNavOpen]);

  // Show loading state until session is loaded
  if (session === undefined) {
    return <div>Loading...</div>; // Customize your loading spinner or component
  }

  return (
    <div className="w-screen h-screen flex md:flex-row flex-col bg-[#F7F9FC] overflow-hidden">
      {/* Top Navigation */}
      <TopNav onMenuClick={toggleSideNav} />

      {/* Main Layout */}
      <div className="flex w-full h-full">
        <SideNav
          isOpen={isSideNavOpen}
          onClose={toggleSideNav}
          ref={sideNavRef}
          isAssessor={isAssessorOrDataEntry}
        />
        {/* Page Content */}
        <div className="flex-1 bg-white w-full h-[92vh] mt-[9vh] overflow-y-auto scroller">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
