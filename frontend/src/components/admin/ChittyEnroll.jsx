import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdPictureAsPdf } from "react-icons/md";
import {
  fetchChitty,
  fetchUsers,
  fetchUsersByFilter,
} from "../services/services";
import { toast, ToastContainer } from "react-toastify";

const ChittyEnroll = () => {
  const [chittiesList, setChittiesList] = useState([]);
  const [selectedChitty, setSelectedChitty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const loadChitties = async () => {
      try {
        const chittiesResponse = await fetchChitty();
        setChittiesList([
          { label: "All", value: "ALL" },
          ...chittiesResponse.map((chitty) => ({
            label: chitty.chitty_name,
            value: chitty.id,
          })),
        ]);
      } catch (error) {
        toast.error("Error fetching chitties:", { toastId: "121" });
      }
    };

    loadChitties();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const chittyId =
          selectedChitty && selectedChitty?.value !== "ALL"
            ? [selectedChitty?.value]
            : [];
        const usersResponse =
          chittyId.length > 0
            ? await fetchUsersByFilter({ chittyIds: chittyId })
            : await fetchUsers();
        setUsers(usersResponse);
      } catch (error) {
        toast.error("Error fetching users:", { toastId: "122" });
      }
    };

    loadUsers();
  }, [selectedChitty]);

  const usersPerPage = 7;

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedChitty && selectedChitty.value !== "ALL"
        ? user.chitties.includes(Number(selectedChitty.value))
        : true
    );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleChittyChange = (selectedOption) => {
    setSelectedChitty(selectedOption);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${selectedChitty.label}`, 20, 10);
    doc.autoTable({
      head: [["ID", "Name", "Mobile", "Email","District","State","Reference","Reference Detail"]],
      body: sortedUsers.map((user) => [
        user.id,
        user.name,
        user.mobile_number,
        user.email,
        user.district,
        user.state,
        user.reference,
        user.reference_detail
      ]),
    });
 // Generate current date and time in DDMMYYYY_HHMM format
 const now = new Date();
 const day = String(now.getDate()).padStart(2, '0');
 const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
 const year = now.getFullYear();
 const hours = String(now.getHours()).padStart(2, '0');
 const minutes = String(now.getMinutes()).padStart(2, '0');
 
 const timestamp = `${day}${month}${year}`;
 
 // Save the file with timestamp in the filename
 doc.save(`${selectedChitty.label}- ${timestamp}.pdf`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10 pb-3 px-4">
        <div className="w-full md:w-3/4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Chitty Enrollment
          </h1>
          <div className="flex flex-col md:flex-row w-full items-center mb-4">
            <input
              type="text"
              className="block w-full md:w-56 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-600 focus:border-blue-600 p-2.5 mb-4 md:mb-0"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="flex flex-1 items-center space-x-4 mx-4">
              <Select
                id="chitty-filter"
                options={chittiesList}
                onChange={handleChittyChange}
                className="flex-1 text-sm"
                placeholder="Select a Chitty"
                value={selectedChitty}
              />

              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center bg-[#252eb1] text-gray-100 font-semibold py-2 px-6 rounded-lg hover:opacity-90"
              >
                Export <MdPictureAsPdf className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto w-full md:w-3/4 shadow-md sm:rounded-lg my-8">
          {sortedUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No records found
            </div>
          ) : (
            <>
              <table className="w-full text-md text-left text-gray-700">
                <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-3 text-center cursor-pointer"
                      onClick={() => requestSort("id")}
                    >
                      ID{" "}
                      {sortConfig.key === "id" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-4 py-3">
                      District
                    </th>
                    <th scope="col" className="px-4 py-3">
                      State
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Mobile
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Reference
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Reference Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white border-b"
                          : "bg-gray-200 border-b"
                      }
                    >
                      <td className="px-2 py-3 text-gray-900 text-center">
                        {user.id}
                      </td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.address}</td>
                      <td className="px-4 py-3">{user.district}</td>
                      <td className="px-4 py-3">{user.state}</td>
                      <td className="px-4 py-3">{user.mobile_number}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.reference}</td>
                      <td className="px-4 py-3">{user.reference_detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {sortedUsers.length > usersPerPage && (
          <div className="w-full md:w-3/4 px-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded bg-blue-600 text-white disabled:opacity-50"
              >
                Previous
              </button>
              <div className="text-center text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded bg-blue-600 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" limit={1} />
    </>
  );
};

export default ChittyEnroll;
