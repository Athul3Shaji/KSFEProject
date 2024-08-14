import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiSearch } from "react-icons/ci";

const initialEmployees = [
  { id: 1001, name: "John Doe", mobile: "1234567890", email: "john@example.com" },
  { id: 1002, name: "Jane Smith", mobile: "0987654321", email: "jane@example.com" },
  { id: 1003, name: "Alice Johnson", mobile: "1231231234", email: "alice@example.com" },
  { id: 1004, name: "Bob Brown", mobile: "3213214321", email: "bob@example.com" },
  { id: 1005, name: "Charlie White", mobile: "4564564567", email: "charlie@example.com" },
  { id: 1006, name: "David Black", mobile: "9876543210", email: "david@example.com" },
  { id: 1007, name: "Emma Green", mobile: "6543219870", email: "emma@example.com" },
  { id: 1008, name: "Frank Moore", mobile: "4567890123", email: "frank@example.com" },
];

const Employee = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    mobile: "",
    email: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.mobile.includes(searchTerm) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 7;

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const validateData = () => {
    if (!/^\d+$/.test(newEmployee.id)) {
      toast.error("Invalid Employee ID. It should be numeric.");
      return false;
    }
    if (!/^\d{10}$/.test(newEmployee.mobile)) {
      toast.error("Invalid Mobile Number. It should be 10 digits.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      toast.error("Invalid Email Address.");
      return false;
    }
    if (employees.some(emp => emp.id === newEmployee.id && !isEditMode)) {
      toast.error("Employee ID already exists.");
      return false;
    }
    return true;
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!validateData()) return;

    if (isEditMode) {
      const updatedEmployees = employees.map((emp, index) =>
        index === editIndex ? newEmployee : emp
      );
      setEmployees(updatedEmployees);
      toast.success("Employee updated successfully.");
      setIsEditMode(false);
    } else {
      setEmployees((prev) => [...prev, newEmployee]);
      toast.success("Employee added successfully.");
    }

    setNewEmployee({ id: "", name: "", mobile: "", email: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewEmployee(employees[index]);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    toast.success("Employee deleted successfully.");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewEmployee({ id: "", name: "", mobile: "", email: "" });
    setIsEditMode(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Employees
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
            Add Employee <FaCirclePlus className="ml-1 mt-1 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div className="w-3/5 mb-4 flex justify-end"></div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/5">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
              <tr>
                <th scope="col" className="px-2 py-3">Employee ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-7 py-3">Mobile</th>
                <th scope="col" className="px-11 py-3">Email</th>
                <th scope="col" className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`${index % 2 === 0 ? "bg-gray-200" : "bg-blue-50"} border-b`}
                >
                  <th
                    scope="row"
                    className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap text-base"
                  >
                    {employee.id}
                  </th>
                  <td className="px-2 py-3 text-base">{employee.name}</td>
                  <td className="px-2 py-3 text-base">{employee.mobile}</td>
                  <td className="px-2 py-3 text-base">{employee.email}</td>
                  <td className="px-2 py-3 flex space-x-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(index)}
                    >
                      <MdEdit className="w-5 h-5"/>
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrashAlt className="w-4 h-4"/>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length > employeesPerPage && (
            <div className="flex justify-between items-center p-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1 ? "bg-gray-400 text-gray-600" : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
                }`}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages ? "bg-gray-400 text-gray-600" : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div
            id="crud-modal"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50"
          >
            <div ref={modalRef} className="relative p-4 w-full max-w-lg max-h-full">
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
                <form className="p-4 md:p-5" onSubmit={handleAddEmployee}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="id"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Employee ID
                      </label>
                      <input
                        type="text"
                        name="id"
                        id="id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Enter employee ID"
                        value={newEmployee.id}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Enter employee name"
                        value={newEmployee.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="mobile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        id="mobile"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Enter mobile number"
                        value={newEmployee.mobile}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder="Enter email address"
                        value={newEmployee.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-900 text-gray-100 inline-flex items-center hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      {isEditMode ? "Update Employee" : "Add Employee"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Employee;
