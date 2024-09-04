import React, { useState } from "react";
import Navbar from "../Navbar";
import Enquiry from "./Enquiry";
import UserList from "./UserList";

const SwitchPage = () => {
  const [activeComponent, setActiveComponent] = useState("enquiry");

  const handleTabClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-2 pb-3 px-4">
        <div className="w-full">
          <div className="flex border-b border-gray-300 mb-1">
            <button
              onClick={() => handleTabClick("enquiry")}
              className={`px-4 py-2 text-lg font-semibold ${activeComponent === "enquiry" ? "border-b-4 rounded border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Add User
            </button>
            <button
              onClick={() => handleTabClick("userList")}
              className={`px-4 py-2 text-lg font-semibold ${activeComponent === "userList" ? "border-b-4 rounded border-blue-600 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              List
            </button>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            {activeComponent === "enquiry" && <Enquiry />}
            {activeComponent === "userList" && <UserList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchPage;
