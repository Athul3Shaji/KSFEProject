import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdPictureAsPdf } from "react-icons/md";
import { fetchChitty, fetchUsers } from "../services/services";

const ChittyEnroll = () => {
  const [chittiesList, setChittiesList] = useState([]);
  const [selectedChitty, setSelectedChitty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadChittiesAndUsers = async () => {
      try {
        const chittiesResponse = await fetchChitty();
        // const usersResponse = await fetchUsers();

        const usersResponse = [
          {
            id: "E009",
            name: "Daniel Martinez",
            mobile: "7788990011",
            email: "daniel.martinez@example.com",
            chitty:
              "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
          },
        ];
        
        setChittiesList([
          { label: "All", value: "ALL" },
          ...chittiesResponse.map((chitty) => ({
            
            label: chitty.chitty_name,
            value: chitty.id,
          })),
        ]);
        setUsers(usersResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadChittiesAndUsers();
  }, []);

  const usersPerPage = 7;

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedChitty && selectedChitty.value !== "ALL"
        ? user.chitty === selectedChitty.label
        : true
    );

  const handleChittyChange = (selectedOption) => {
    setSelectedChitty(selectedOption);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Chitty Enrollment List", 20, 10);
    doc.autoTable({
      head: [["User ID", "Name", "Mobile", "Email"]],
      body: filteredUsers.map((user) => [
        user.id,
        user.name,
        user.mobile,
        user.email,
      ]),
    });
    doc.save("chitty enrollment.pdf");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10 px-4">
        <div className="w-3/5">
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

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-3/5 my-8">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No records found
            </div>
          ) : (
            <>
              <table className="w-full text-md text-left text-gray-700">
                <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
                  <tr>
                    <th scope="col" className="px-2 py-3">
                      User ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-7 py-3">
                      Mobile
                    </th>
                    <th scope="col" className="px-11 py-3">
                      Email
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
                      <td className="px-2 py-3 text-gray-900">{user.id}</td>
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-7 py-3">{user.mobile}</td>
                      <td className="px-11 py-3">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {filteredUsers.length > usersPerPage && (
          <div className="w-3/5 px-4">
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
    </>
  );
};

export default ChittyEnroll;
