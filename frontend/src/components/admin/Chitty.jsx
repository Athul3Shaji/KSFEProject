import React, { useState, useEffect } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import { CiSearch } from "react-icons/ci";
import {
  fetchChitty,
  addChitty,
  updateChitty,
  deleteChitty,
} from "../services/services";

const Chitty = () => {
  const [chitties, setChitties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChitty, setNewChitty] = useState({
    chitty_code: "",
    chitty_name: "",
    chitty_tenure: "",
    per_month_emi: "",
    total_amount: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chittiesPerPage = 7;

  useEffect(() => {
    const loadChitties = async () => {
      try {
        const response = await fetchChitty();
        setChitties(response); // Assuming response is an array
      } catch (error) {
        toast.error("Failed to fetch chitties.");
      }
    };

    loadChitties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChitty((prev) => ({ ...prev, [name]: value }));
  };

  const validateData = () => {
    const {
      chitty_code,
      chitty_name,
      chitty_tenure,
      per_month_emi,
      total_amount,
    } = newChitty;
    if (!chitty_code.trim()) {
      toast.error("Chitty CODE cannot be empty.");
      return false;
    }
    if (!chitty_name.trim()) {
      toast.error("Chitty Name cannot be empty.");
      return false;
    }
    if (!chitty_tenure.trim()) {
      toast.error("Chitty Tenure cannot be empty.");
      return false;
    }
    if (!per_month_emi.trim()) {
      toast.error("Per Month EMI cannot be empty.");
      return false;
    }
    if (!total_amount.trim()) {
      toast.error("Total Amount cannot be empty.");
      return false;
    }
    if (
      chitties.some(
        (chitty) => chitty.chitty_code === chitty_code && !isEditMode
      )
    ) {
      toast.error("Chitty CODE already exists.");
      return false;
    }
    return true;
  };

  const handleAddChitty = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    try {
      if (isEditMode) {
        await updateChitty(newChitty);
        const updatedChitties = chitties.map((chitty) =>
          chitty.id === editId ? newChitty : chitty
        );
        setChitties(updatedChitties);
        toast.success("Chitty updated successfully.");
        setIsEditMode(false);
      } else {
        await addChitty(newChitty);
        setChitties((prev) => [...prev, newChitty]);
        toast.success("Chitty added successfully.");
      }
      setNewChitty({
        chitty_code: "",
        chitty_name: "",
        chitty_tenure: "",
        per_month_emi: "",
        total_amount: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save chitty.");
    }
  };

  const handleEdit = (id) => {
    const chittyToEdit = chitties.find((chitty) => chitty.id === id);
    setEditId(id);
    setNewChitty({ ...chittyToEdit });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteChitty(id);
      setChitties((prev) => prev.filter((chitty) => chitty.id !== id));
      toast.success("Chitty deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete chitty.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewChitty({
      chitty_code: "",
      chitty_name: "",
      chitty_tenure: "",
      per_month_emi: "",
      total_amount: "",
    });
    setIsEditMode(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      handleCloseModal();
    }
  };

  const filteredChitties = chitties.filter(
    (chitty) =>
      chitty.chitty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chitty.chitty_code.toString().includes(searchTerm) ||
      chitty.chitty_tenure
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
      <div className="min-h-screen bg-white flex flex-col items-center pt-10">
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

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/5">
          {filteredChitties.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
                <tr>
                  <th scope="col" className="px-2 py-3">
                    Chitty CODE
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Chitty Name
                  </th>
                  <th scope="col" className="px-7 py-3">
                    Chitty Tenure
                  </th>
                  <th scope="col" className="px-7 py-3">
                    Per Month EMI
                  </th>
                  <th scope="col" className="px-7 py-3">
                    Total Amount
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedChitties.map((chitty) => (
                  <tr
                    key={chitty.id} // Use chitty.id here
                    className="bg-white border-b text-gray-600"
                  >
                    <td className="px-2 py-4">{chitty.chitty_code}</td>
                    <td className="px-6 py-4">{chitty.chitty_name}</td>
                    <td className="px-7 py-4">{chitty.chitty_tenure}</td>
                    <td className="px-7 py-4">{chitty.per_month_emi}</td>
                    <td className="px-7 py-4">{chitty.total_amount}</td>
                    <td className="px-3 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(chitty.id)}
                        className="text-blue-600"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chitty.id)}
                        className="text-red-600"
                      >
                        <FaTrashAlt className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4">No chitties found</div>
          )}

          {filteredChitties.length > chittiesPerPage && (
            <div className="flex justify-between mt-4 px-4">
              <button
                onClick={handlePrevPage}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="self-center text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div
            id="modal-overlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            onClick={handleOverlayClick}
          >
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t bg-blue-800">
                <h3 className="text-lg font-semibold text-white">
                  {isEditMode ? "Edit Employee" : "Add New Employee"}
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
              <form onSubmit={handleAddChitty} className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-3">
                  <div className="col-span-1">
                    <label
                      htmlFor="chitty_code"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Chitty CODE
                    </label>
                    <input
                      type="text"
                      id="chitty_code"
                      name="chitty_code"
                      value={newChitty.chitty_code}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                      disabled={isEditMode}
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="chitty_name"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Chitty Name
                    </label>
                    <input
                      type="text"
                      id="chitty_name"
                      name="chitty_name"
                      value={newChitty.chitty_name}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="chitty_tenure"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Chitty Tenure (Months)
                    </label>
                    <input
                      type="text"
                      id="chitty_tenure"
                      name="chitty_tenure"
                      value={newChitty.chitty_tenure}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="per_month_emi"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Per Month EMI
                    </label>
                    <input
                      type="text"
                      id="per_month_emi"
                      name="per_month_emi"
                      value={newChitty.per_month_emi}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="total_amount"
                      className="block mb-2 text-md font-medium text-gray-900"
                    >
                      Total Amount
                    </label>
                    <input
                      type="text"
                      id="total_amount"
                      name="total_amount"
                      value={newChitty.total_amount}
                      onChange={handleInputChange}
                      className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {isEditMode ? "Update Chitty" : "Add Chitty"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastContainer position="top-center"/>
      </div>
    </>
  );
};

export default Chitty;
