import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { MdFeaturedPlayList, MdOutlineStreetview } from "react-icons/md";
import { IoIosContacts } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";

const AdminHome = () => {
  const navigate = useNavigate();
  const [showChittyMenu, setShowChittyMenu] = useState(false);
  const menuRef = useRef(null);

  const handleChittyClick = () => {
    setShowChittyMenu((prev) => !prev);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setShowChittyMenu(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowChittyMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center pt-12 bg-gray-200 min-h-[calc(100vh-72px)]">
        <h1 className="text-4xl font-bold mb-10 text-bluedark">Admin Home</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 max-w-screen-xl w-full">
          <div className="relative group" ref={menuRef}>
            <button
              onClick={handleChittyClick}
              className="flex flex-col items-center justify-center w-full h-56 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
              type="button"
            >
              <MdFeaturedPlayList className="w-20 h-20 mb-4 text-gray-700" />
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center flex items-center relative">
                Chitty
                <IoIosArrowForward
                  className={`w-5 h-5 ml-3 text-gray-700 transition-transform duration-300 ${showChittyMenu ? "rotate-90" : ""}`}
                />
                {showChittyMenu && (
                  <div className="absolute top-full left-0 mt-2 z-20 bg-neutral-600 text-neutral-200 divide-y divide-gray-100 rounded-lg shadow w-64 max-h-48 overflow-y-auto">
                    <ul className="py-2 text-sm">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-neutral-500"
                          onClick={() => handleMenuItemClick("/chitty-enrollment")}
                        >
                          View Chitty Enrollment
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-neutral-500 border-t border-gray-200"
                          onClick={() => handleMenuItemClick("/chitty")}
                        >
                          Add/Manage Chitty
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </h5>
              <p className="font-normal text-gray-700 text-center">
                See the list of available chitties and manage them.
              </p>
            </button>
          </div>

          <a
            href="#"
            className="flex flex-col items-center justify-center w-full h-56 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
            onClick={() => navigate("/employee")}
          >
            <IoIosContacts className="w-20 h-20 mb-4 text-gray-700" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">
              Employees
            </h5>
            <p className="font-normal text-gray-700 text-center">
              Manage employee details and manage.
            </p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center justify-center w-full h-56 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
            onClick={() => navigate("/agent")}
          >
            <MdOutlineStreetview className="w-20 h-20 mb-4 text-gray-700" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">
              Agent
            </h5>
            <p className="font-normal text-gray-700 text-center">
              Manage agents and their details.
            </p>
          </a>
          <a
            href="#"
            className="flex flex-col items-center justify-center w-full h-56 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"
            onClick={() => navigate("/admin")}
          >
            <PiSignOutBold className="w-20 h-20 mb-4 text-gray-700" />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">
              Logout
            </h5>
            <p className="font-normal text-gray-700 text-center">
              Exit to login page
            </p>
          </a>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
