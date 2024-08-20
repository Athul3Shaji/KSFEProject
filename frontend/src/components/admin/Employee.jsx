import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Navbar";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/services";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    code: "",
    email: "",
    mobile: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    code: "",
    email: "",
    mobile: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const filteredEmployees = employees.filter((employee) => {
    const name = employee.name ? employee.name.toLowerCase() : "";
    const email = employee.email ? employee.email.toLowerCase() : "";
    const mobile = employee.mobile ? employee.mobile : "";

    return (
      name.includes(searchTerm.toLowerCase()) ||
      mobile.includes(searchTerm) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 7;

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
      } catch (error) {
        toast.error("Error fetching employees.",{toastId:"920"});
      }
    };
    fetchData();
  }, []);

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
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
    let isValid = true;
    const errors = { name: "", code: "", mobile: "", email: "" };

    if (!newEmployee.name || !newEmployee.name.trim()) {
      errors.name = "*Employee Name is required.";
      isValid = false;
    }
    if (!newEmployee.code || !newEmployee.code.trim()) {
      errors.code = "*Employee Code is required.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(newEmployee.mobile)) {
      errors.mobile = "*Mobile Number Should be 10 digits.";
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
      errors.email = "*Invalid Email Address.";
      isValid = false;
    }
    if (
      employees.some(
        (employee) =>
          employee.employee_code === newEmployee.code &&
          employee.id !== newEmployee.id
      )
    ) {
      errors.code = "*Employee code already exists.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    const employeeData = {
      employee_name: newEmployee.name,
      employee_code: newEmployee.code,
      employee_mobile: Number(newEmployee.mobile),
      employee_email: newEmployee.email,
    };

    try {
      if (isEditMode) {
        await updateEmployee(newEmployee.id, employeeData);
        const updatedEmployees = employees.map((employee) =>
          employee.id === newEmployee.id
            ? { ...employee, ...employeeData }
            : employee
        );
        setEmployees(updatedEmployees);
        toast.success("Employee updated successfully.",{toastId:"921"});
      } else {
        const response = await addEmployee(employeeData);
        const newEmployeeWithId = { ...employeeData, id: response.id };
        setEmployees((prev) => [...prev, newEmployeeWithId]);
        toast.success("Employee added successfully.",{toastId:"922"});
      }
    } catch (error) {
      toast.error("Error occurred while saving employee.",{toastId:"923"});
    }

    handleCloseModal();
  };

  const handleEdit = (employeeId) => {
    const employeeToEdit = employees.find(
      (employee) => employee.id === employeeId
    );
    setNewEmployee({
      id: employeeToEdit.id,
      name: employeeToEdit.employee_name,
      code: employeeToEdit.employee_code,
      mobile: employeeToEdit.employee_mobile,
      email: employeeToEdit.employee_email,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      setEmployees((prev) =>
        prev.filter((employee) => employee.id !== employeeId)
      );
      toast.success("Employee deleted successfully.",{toastId:"924"});
    } catch (error) {
      toast.error("Error deleting employee.",{toastId:"925"});
    }
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
                <th scope="col" className="px-2 py-3 cursor-pointer"
                onClick={() => handleSort("id")}>
                  Employee ID{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 cursor-pointer"
                  onClick={() => handleSort("employee_name")}
                >
                  Name{" "}
                  {sortConfig.key === "employee_name" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className="px-7 py-3 cursor-pointer"
                  onClick={() => handleSort("employee_code")}
                >
                  Employee Code{" "}
                  {sortConfig.key === "employee_code" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className="px-11 py-3 cursor-pointer"
                  onClick={() => handleSort("employee_email")}
                >
                  Email{" "}
                  {sortConfig.key === "employee_email" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 cursor-pointer"
                  onClick={() => handleSort("employee_mobile")}
                >
                  Mobile{" "}
                  {sortConfig.key === "employee_mobile" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th scope="col" className="px-3 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-200" : "bg-blue-50"
                  } border-b`}
                >
                  <th
                    scope="row"
                    className="px-2 py-3 font-medium text-gray-900 whitespace-nowrap text-base"
                  >
                    {employee.id}
                  </th>
                  <td className="px-2 py-3 text-base">
                    {employee.employee_name}
                  </td>
                  <td className="px-2 py-3 text-base">
                    {employee.employee_code}
                  </td>
                  <td className="px-2 py-3 text-base">
                    {employee.employee_email}
                  </td>
                  <td className="px-2 py-3 text-base">
                    {employee.employee_mobile}
                  </td>
                  <td className="px-2 py-3 flex space-x-4">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(employee.id)}
                    >
                      <MdEdit className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <FaTrashAlt className="w-5 h-5" />
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
                  currentPage === 1
                    ? "bg-gray-400 text-gray-600"
                    : "bg-blue-600 text-gray-100 hover:bg-[#055160]"
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
            id="crud-modal"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-900 bg-opacity-50"
          >
            <div
              ref={modalRef}
              className="relative p-4 w-full max-w-lg max-h-full"
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
                <form onSubmit={handleAddEmployee} className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="employee-name"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        Name<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        id="employee-name"
                        name="name"
                        value={newEmployee.name}
                        onChange={handleInputChange}
                        className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                        placeholder="Enter employee name"
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
                        htmlFor="employee-code"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        Employee Code<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        id="employee-code"
                        name="code"
                        value={newEmployee.code}
                        onChange={handleInputChange}
                        className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                        placeholder="Enter employee code"
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
                        htmlFor="employee-email"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        Email<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="email"
                        id="employee-email"
                        name="email"
                        value={newEmployee.email}
                        onChange={handleInputChange}
                        className="block w-full text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5"
                        placeholder="Enter email"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="employee-mobile"
                        className="block mb-2 text-md font-medium text-gray-900"
                      >
                        Mobile<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        id="employee-mobile"
                        name="mobile"
                        value={newEmployee.mobile}
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
                      {isEditMode ? "Update Employee" : "Add New Employee"}
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

export default Employee;
