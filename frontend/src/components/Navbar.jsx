import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/ksfe-logo.svg";
import { IoIosArrowForward } from "react-icons/io";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useLogout } from "./services/services";

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const submenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    // Close submenu and dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setIsSubMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useLogout();

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-[#06296b] border-gray-200 relative z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="#"
          className="flex cursor-default items-center space-x-3"
        >
          <div className="p-1 rounded-xl bg-white">
            <img src={logo} className="h-8" alt="KSFE Logo" />
          </div>
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white ">
            Palarivattom
          </span>
        </a>

        <div className="flex md:order-2">
          {userType === "admin" ? (
            <button
              data-collapse-toggle="navbar-menu"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          ) : (
            <div ref={dropdownRef} className="relative flex-shrink-0">
              <div className="flex p-2">
                <FaUserCircle
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-4xl cursor-pointer text-white"
                />
                <h5 className="text-white ml-2 mt-2">User</h5>
              </div>
              {showDropdown && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                  >
                    Sign Out
                    <FaSignOutAlt className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {userType === "admin" && (
          <div
            className={`absolute top-16 left-0 right-0 mr-40 bg-[#06296b] text-white md:relative md:top-auto md:left-auto md:right-auto md:bg-[#06296b] md:flex md:items-center md:w-auto md:space-x-8 md:mt-0 md:border-0 ${
              isMobileMenuOpen ? "block" : "hidden"
            }`}
            id="navbar-menu"
          >
            <ul className="flex flex-col p-4 font-medium border border-gray-100 rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-[#06296b]">
              <li>
                <NavLink
                  to="/adminhome"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-[#7fb715] md:p-0"
                      : "block py-2 px-3 text-white md:p-0"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="relative">
                <NavLink
                  to="#"
                  className="flex items-center space-x-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSubMenuOpen(!isSubMenuOpen);
                  }}
                >
                  <span className="block py-2 px-3 text-white md:p-0">
                    Services
                  </span>
                  <IoIosArrowForward
                    className={`text-white transition-transform duration-300 ${
                      isSubMenuOpen ? "rotate-90" : ""
                    }`}
                  />
                </NavLink>
                {isSubMenuOpen && (
                  <ul
                    ref={submenuRef}
                    className="absolute top-full left-0 mt-2 w-64 bg-neutral-600 text-neutral-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                    style={{ maxHeight: "300px" }}
                  >
                    <li>
                      <NavLink
                        to="/chitty-enrollment"
                        className={({ isActive }) =>
                          isActive
                            ? "block px-4 py-2 text-sm bg-neutral-500 text-white"
                            : "block px-4 py-2 text-sm hover:bg-neutral-500"
                        }
                      >
                        View Chitty Enrollment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/chitty"
                        className={({ isActive }) =>
                          isActive
                            ? "block px-4 py-2 text-sm bg-neutral-500 text-white"
                            : "block px-4 py-2 text-sm hover:bg-neutral-500"
                        }
                      >
                        Add/Manage Chitty
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/employee"
                        className={({ isActive }) =>
                          isActive
                            ? "block px-4 py-2 text-sm bg-neutral-500 text-white"
                            : "block px-4 py-2 text-sm hover:bg-neutral-500"
                        }
                      >
                        Manage Employees
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/agent"
                        className={({ isActive }) =>
                          isActive
                            ? "block px-4 py-2 text-sm bg-neutral-500 text-white"
                            : "block px-4 py-2 text-sm hover:bg-neutral-500"
                        }
                      >
                        Manage Agent
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive
                      ? "block py-2 px-3 text-[#7fb715] md:p-0"
                      : "block py-2 px-3 text-white md:p-0"
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center py-2 px-3 text-white md:p-0"
                >
                  Logout <FaSignOutAlt className="ml-1 mt-1" />
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
