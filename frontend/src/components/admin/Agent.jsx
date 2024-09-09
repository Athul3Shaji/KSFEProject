import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import {
  addAgent,
  updateAgent,
  deleteAgent,
  fetchAgents,
} from "../services/services";

const AgentsPerPage = 7;

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    code: "",
    mobile: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    code: "",
    mobile: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsData = await fetchAgents();
        setAgents(agentsData);
      } catch (error) {
        toast.error("Error fetching agents.",{toastId:"930"});
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        handleCloseModal();
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
    let isValid = true;
    const errors = { name: "", code: "", mobile: "" };

    if (!newAgent.name.trim()) {
      errors.name = "*Agent Name is required.";
      isValid = false;
    }
    if (!newAgent.code.trim()) {
      errors.code = "*Agent Code is required.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(newAgent.mobile)) {
      errors.mobile = "*Mobile Number Should be 10 digit";
      isValid = false;
    }
    if (
      agents.some(
        (agent) =>
          agent.agent_code === newAgent.code && agent.id !== newAgent.id
      )
    ) {
      errors.code = "*Agent code already exists.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!validateData()) return;
  
    const agentData = {
      agent_name: newAgent.name,
      agent_code: newAgent.code,
      agent_mobile: Number(newAgent.mobile),
    };
  
    try {
      if (isEditMode) {
        await updateAgent(newAgent.id, agentData);
        const updatedAgents = agents.map((agent) =>
          agent.id === newAgent.id ? { ...agent, ...agentData } : agent
        );
        setAgents(updatedAgents);
        toast.success("Agent updated successfully.", { toastId: "931" });
        setIsEditMode(false);
        handleCloseModal(); // Move handleCloseModal here so it closes only if there’s no error
      } else {
        const response = await addAgent(agentData);
        const newAgentWithId = { ...agentData, id: response.id };
        setAgents((prev) => [...prev, newAgentWithId]);
        toast.success("Agent added successfully.", { toastId: "932" });
        handleCloseModal(); // Move handleCloseModal here so it closes only if there’s no error
      }
    } catch (error) {
      // Check for specific error codes
      if (error.response && error.response.data.errors) {
        const errorCodes = error.response.data.errors.map((err) => err.code);
  
        if (errorCodes.includes("ERR_AGENT_MOBILE_UNIQUE")) {
          toast.error("Agent mobile must be unique.", { toastId: "933" });
        } else {
          toast.error("Error occurred while saving agent.", { toastId: "934" });
        }
      } else {
        toast.error("Unexpected error occurred.", { toastId: "935" });
      }
    }
  };  

  const handleEdit = (agentId) => {
    const agentToEdit = agents.find((agent) => agent.id === agentId);
    setNewAgent({
      id: agentToEdit.id,
      name: agentToEdit.agent_name,
      code: agentToEdit.agent_code,
      mobile: agentToEdit.agent_mobile,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (agentId) => {
    try {
      await deleteAgent(agentId);
      setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
      toast.success("Agent deleted successfully.",{toastId:"934"});
    } catch (error) {
      toast.error("Error deleting agent.",{toastId:"935"});
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };   
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormErrors("");
    setNewAgent({ id: null, name: "", code: "", mobile: "" });
    setIsEditMode(false);
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agent_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agent_mobile.toString().includes(searchTerm)
  );

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Agents
        </h1>
        <div className="w-3/4 flex justify-between items-center mb-4">
          <div className="flex w-full justify-between">
            <div className="relative w-80">
              <label htmlFor="chitty-search" className="sr-only">
                Search
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CiSearch className="text-gray-500 w-5 h-5" />
              </div>
              <input
                type="text"
                id="chitty-search"
                className="block w-full pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-auto">
              <button
                className="bg-blue-900 text-gray-100 px-4 py-2 flex rounded-md hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                Add agent <FaCirclePlus className="ml-1 mt-1 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/4">
        {filteredAgents.length === 0 ? (
    <div className="text-center py-4 text-gray-500">
      No agents found.
    </div>
  ) : (
          <table className="w-full text-md text-left text-gray-700">
            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
  <tr>
    <th
      scope="col"
      className="px-2 py-3 cursor-pointer"
      onClick={() => requestSort('id')}
    >
      Agent ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
    </th>
    <th
      scope="col"
      className="px-6 py-3 cursor-pointer"
      onClick={() => requestSort('name')}
    >
      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
    </th>
    <th
      scope="col"
      className="px-7 py-3 cursor-pointer"
      onClick={() => requestSort('code')}
    >
      Code {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
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
  {sortedAgents.slice(startIndex, startIndex + AgentsPerPage).map((agent, index) => (
    <tr
      key={agent.id}
      className={`${
        index % 2 === 0 ? "bg-gray-200" : "bg-blue-50"
      } border-b`}
    >
      <th
        scope="row"
        className="px-7 py-3 font-medium text-gray-900 whitespace-nowrap text-base"
      >
        {agent.id}
      </th>
      <td className="px-2 py-3 text-base">{agent.agent_name}</td>
      <td className="px-5 py-3 text-base">{agent.agent_code}</td>
      <td className="px-5 py-3 text-base">{agent.agent_mobile}</td>
      <td className="px-2 py-3 flex space-x-4">
        <a
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleEdit(agent.id)}
        >
          <MdEdit className="w-5 h-5" />
        </a>
        <a
          className="text-red-600 hover:text-red-800 cursor-pointer"
          onClick={() => handleDelete(agent.id)}
        >
          <FaTrashAlt className="w-5 h-5" />
        </a>
      </td>
    </tr>
  ))}
</tbody>

          </table>
  )}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-400 text-gray-600"
                    : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-400 text-gray-600"
                    : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
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
                <h3 className="text-lg font-semibold text-white">
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
                  <div className="col-span-2">
                    <label
                      htmlFor="agent-name"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Name<sup className="text-red-500">*</sup>
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
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="agent-code"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Agent Code<sup className="text-red-500">*</sup>
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
                    {formErrors.code && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.code}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="agent-mobile"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Mobile<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      type="text"
                      id="agent-mobile"
                      name="mobile"
                      value={newAgent.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      placeholder="Enter mobile number"
                      required
                    />
                    {formErrors.mobile && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.mobile}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-900 text-white inline-flex items-center hover:bg-blue-700 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                  >
                    {isEditMode ? "Update Agent" : "Add New Agent"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" limit={1} />
    </>
  );
};

export default Agent;
