import React, { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import { CiSearch } from "react-icons/ci";

const initialChitties = [
  {
    id: "1678385",
    name: "KSFE Galaxy Chit Series-1",
    period: "April 2024 - June 2024",
  },
  {
    id: "1678386",
    name: "KSFE Galaxy Chit Series-2",
    period: "July 2024 - October 2024",
  },
  {
    id: "1678387",
    name: "KSFE Galaxy Chit Series-3",
    period: "November 2024 - February 2025",
  },
  {
    id: "1678388",
    name: "KSFE Galaxy Chit Series-4",
    period: "March 2025 - June 2025",
  },
  {
    id: "1678389",
    name: "KSFE Galaxy Chit Series-5",
    period: "July 2025 - October 2025",
  },
  {
    id: "1678390",
    name: "KSFE Galaxy Chit Series-6",
    period: "November 2025 - February 2026",
  },
  {
    id: "1678391",
    name: "KSFE Galaxy Chit Series-7",
    period: "March 2026 - June 2026",
  },
  {
    id: "1678392",
    name: "KSFE Galaxy Chit Series-8",
    period: "July 2026 - October 2026",
  },
  {
    id: "1678393",
    name: "KSFE Galaxy Chit Series-9",
    period: "November 2026 - February 2027",
  },
];

const Chitty = () => {
  const [chitties, setChitties] = useState(initialChitties);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChitty, setNewChitty] = useState({
    id: "",
    name: "",
    period: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chittiesPerPage = 7;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChitty((prev) => ({ ...prev, [name]: value }));
  };

  const validateData = () => {
    if (!newChitty.id.trim()) {
      toast.error("Chitty ID cannot be empty.");
      return false;
    }
    if (!newChitty.name.trim()) {
      toast.error("Chitty Name cannot be empty.");
      return false;
    }
    if (!newChitty.period.trim()) {
      toast.error("Chitty Period cannot be empty.");
      return false;
    }
    if (chitties.some((chitty) => chitty.id === newChitty.id && !isEditMode)) {
      toast.error("Chitty ID already exists.");
      return false;
    }
    return true;
  };

  const handleAddChitty = (e) => {
    e.preventDefault();
    if (!validateData()) return;

    if (isEditMode) {
      const updatedChitties = chitties.map((chitty, index) =>
        index === editIndex ? newChitty : chitty
      );
      setChitties(updatedChitties);
      toast.success("Chitty updated successfully.");
      setIsEditMode(false);
    } else {
      setChitties((prev) => [...prev, newChitty]);
      toast.success("Chitty added successfully.");
    }

    setNewChitty({ id: "", name: "", period: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (itemIndex) => {
    const actualIndex = (currentPage - 1) * chittiesPerPage + itemIndex;
    setEditIndex(actualIndex);
    setNewChitty({ ...chitties[actualIndex] });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (itemIndex) => {
    const actualIndex = (currentPage - 1) * chittiesPerPage + itemIndex;
    setChitties((prev) => prev.filter((_, i) => i !== actualIndex));
    toast.success("Chitty deleted successfully.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewChitty({ id: "", name: "", period: "" });
    setIsEditMode(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      handleCloseModal();
    }
  };

  const filteredChitties = chitties.filter(
    (chitty) =>
      chitty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chitty.id.includes(searchTerm) ||
      chitty.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChitties.length / chittiesPerPage);
  const displayedChitties = filteredChitties.slice(
    (currentPage - 1) * chittiesPerPage,
    currentPage * chittiesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
  <Navbar />
  <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10">
  <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Chitties
          </h1>
    <div className="w-3/5 flex justify-between items-center mb-4">
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
            Add Chitty <FaCirclePlus className="ml-1 mt-1 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div className="w-3/5 mb-4 flex justify-end"></div>

    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/5">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
          <tr>
            <th scope="col" className="px-2 py-3">
              Chitty ID
            </th>
            <th scope="col" className="px-6 py-3">
              Chitty Name
            </th>
            <th scope="col" className="px-7 py-3">
              Period
            </th>
            <th scope="col" className="px-3 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedChitties.map((chitty, index) => (
            <tr
              key={chitty.id}
              className={
                index % 2 === 0 ? "bg-gray-200" : "bg-blue-50 border-b"
              }
            >
              <th
                scope="row"
                className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap text-base"
              >
                {chitty.id}
              </th>
              <td className="px-2 py-3 text-base">{chitty.name}</td>
              <td className="px-2 py-3 text-base">{chitty.period}</td>
              <td className="px-2 py-3 flex space-x-4">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEdit(index)}
                >
                  <MdEdit className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(index)}
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
              currentPage === 1
                ? "bg-gray-400 text-gray-600"
                : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
            }`}
          >
            Previous
          </button>
          <span className="text-base">
            Page {currentPage} of {totalPages}
          </span>
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

    {isModalOpen && (
      <div
        id="modal-overlay"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50"
        onClick={handleOverlayClick}
      >
        <div
          className="relative p-4 w-full max-w-lg max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-blue-800">
              <h3 className="text-lg font-semibold text-white">
                {isEditMode ? "Edit Chitty" : "Add New Chitty"}
              </h3>
              <button
                type="button"
                className="text-white bg-transparent hover:bg-blue-700 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
            <form className="p-4 md:p-5" onSubmit={handleAddChitty}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div>
                  <label
                    htmlFor="id"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Chitty ID
                  </label>
                  <input
                    type="text"
                    name="id"
                    id="id"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    value={newChitty.id}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="period"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Period
                  </label>
                  <input
                    type="text"
                    name="period"
                    id="period"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    value={newChitty.period}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Chitty Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    value={newChitty.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-900 text-gray-100 px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {isEditMode ? "Update Chitty" : "Add New Chitty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
  <ToastContainer position="top-center" />
</>

  );
};

export default Chitty;
