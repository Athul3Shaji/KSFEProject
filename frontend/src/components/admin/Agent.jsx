import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialAgents = [
  { id: 1001, name: "John Doe", code: "AG001", mobile: "1234567890" },
  { id: 1002, name: "Jane Smith", code: "AG002", mobile: "0987654321" },
  { id: 1003, name: "Alice Johnson", code: "AG003", mobile: "1231231234" },
  { id: 1004, name: "Bob Brown", code: "AG004", mobile: "3213214321" },
  { id: 1005, name: "Charlie White", code: "AG005", mobile: "4564564567" },
  { id: 1006, name: "Alice Johnson", code: "AG003", mobile: "1231231234" },
  { id: 1007, name: "Bob Brown", code: "AG004", mobile: "3213214321" },
  { id: 1008, name: "Charlie White", code: "AG005", mobile: "4564564567" },
];

const AgentsPerPage = 7;

const Agent = () => {
  const [agents, setAgents] = useState(initialAgents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    id: "",
    name: "",
    code: "",
    mobile: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  const validateData = () => {
    if (!/^\d+$/.test(newAgent.id)) {
      toast.error("Invalid Agent ID. It should be numeric.");
      return false;
    }
    if (!/^\d{10}$/.test(newAgent.mobile)) {
      toast.error("Invalid Mobile Number. It should be 10 digits.");
      return false;
    }
    if (agents.some((agent) => agent.id === newAgent.id && !isEditMode)) {
      toast.error("Agent ID already exists.");
      return false;
    }
    return true;
  };

  const handleAddAgent = (e) => {
    e.preventDefault();
    if (!validateData()) return;

    if (isEditMode) {
      const updatedAgents = agents.map((agent, index) =>
        index === editIndex ? newAgent : agent
      );
      setAgents(updatedAgents);
      toast.success("Agent updated successfully.");
      setIsEditMode(false);
    } else {
      setAgents((prev) => [...prev, newAgent]);
      toast.success("Agent added successfully.");
    }

    setNewAgent({ id: "", name: "", code: "", mobile: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewAgent(agents[index]);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setAgents((prev) => prev.filter((_, i) => i !== index));
    toast.success("Agent deleted successfully.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewAgent({ id: "", name: "", code: "", mobile: "" });
    setIsEditMode(false);
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.mobile.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredAgents.length / AgentsPerPage);
  const startIndex = (currentPage - 1) * AgentsPerPage;
  const currentAgents = filteredAgents.slice(
    startIndex,
    startIndex + AgentsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10">
        <div className="w-3/5 flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold mb-10 text-blue-800">Agents</h1>
          <div className="relative">
            <label htmlFor="agent-search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              id="agent-search"
              className="block w-80 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
              placeholder="Search for agents"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-3/5 mb-4 flex justify-end">
          <button
            className="bg-blue-800 text-gray-100 px-4 py-2 flex rounded-md hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add Agent <FaCirclePlus className="ml-1 mt-1 w-5 h-5" />
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/5">
          <table className="w-full text-md text-left text-gray-700">
            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
              <tr>
                <th scope="col" className="px-2 py-3">
                  Agent ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-7 py-3">
                  Code
                </th>
                <th scope="col" className="px-11 py-3">
                  Mobile
                </th>
                <th scope="col" className="px-3 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAgents.map((agent, index) => (
                <tr
                  key={agent.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-200" : "bg-blue-50"
                  } border-b`}
                >
                  <th
                    scope="row"
                    className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap text-base"
                  >
                    {agent.id}
                  </th>
                  <td className="px-2 py-3 text-base">{agent.name}</td>
                  <td className="px-2 py-3 text-base">{agent.code}</td>
                  <td className="px-2 py-3 text-base">{agent.mobile}</td>
                  <td className="px-2 py-3 flex space-x-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(startIndex + index)}
                    >
                      <MdEdit className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(startIndex + index)}
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1 ? "bg-gray-400 text-gray-600" : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages? "bg-gray-400 text-gray-600" : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50">
          <div
            ref={modalRef}
            className="relative p-4 w-full max-w-lg max-h-full"
          >
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 text-center border-b rounded-t bg-blue-800">
                <h3 className="text-lg   font-semibold text-white">
                  {isEditMode ? "Edit Agent" : "Add New Agent"}
                </h3>
                <button
                  type="button"
                  className="text-white bg-transparent hover:bg-blue-700 rounded-lg text-md w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={handleCloseModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleAddAgent} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="agent-id"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Agent ID
                    </label>
                    <input
                      type="text"
                      id="agent-id"
                      name="id"
                      value={newAgent.id}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      placeholder="Enter agent ID"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="agent-name"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="agent-name"
                      name="name"
                      value={newAgent.name}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      placeholder="Enter agent name"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="agent-code"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Agent Code
                    </label>
                    <input
                      type="text"
                      id="agent-code"
                      name="code"
                      value={newAgent.code}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      placeholder="Enter agent code"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="agent-mobile"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Mobile
                    </label>
                    <input
                      type="text"
                      id="agent-mobile"
                      name="mobile"
                      value={newAgent.mobile}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-900 text-black inline-flex items-center hover:bg-blue-700 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                  >
                    {isEditMode ? "Update Agent" : "Add New Agent"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Agent;
