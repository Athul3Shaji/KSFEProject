import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import { fetchUsers } from "../services/services";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse);
      } catch (error) {
        toast.error("Error fetching users:", { toastId: "122" });
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile_number.toString().includes(searchTerm)
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      <div className="min-h-[calc(100vh-95px)] bg-gray-100 flex flex-col items-center pt-1 pb-2 px-4">
        <div className="w-full md:w-3/4">
          <h1 className="text-4xl font-bold text-gray-800 mb-1 text-center">
            Users List
          </h1>
          <div className="flex flex-col md:flex-row w-full items-center mb-2">
            <div
              className="flex items-center border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-gray-600
                focus-within:border-gray-600 w-full md:w-56 mb-4 md:mb-0"
            >
              <CiSearch className="text-gray-500 ml-3" />
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-0 focus:outline-none focus:ring-0 p-2.5"
                placeholder="name or mobile"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative overflow-x-auto w-full md:w-full  justify-center items-center shadow-md sm:rounded-lg my-4">
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
                          Mobile
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Reference
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Reference Detail
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Follow-up Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          Enrolled
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
                          <td className="px-4 py-3">{user.mobile_number}</td>
                          <td className="px-4 py-3">{user.reference}</td>
                          <td className="px-4 text-center py-3">
                            {user.reference_detail}
                          </td>
                          <td className="px-4 text-center py-3">
                            {new Date(user.follow_up_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 text-center py-3">
                        {user.enrolled_chitties ? (
                          <div className="text-left">
                            {(() => {
                              // Parse the JSON string into an array
                              const enrolledChittiesArray = JSON.parse(
                                user.enrolled_chitties
                              );

                              // Check if the parsed value is an array and has elements
                              if (
                                Array.isArray(enrolledChittiesArray) &&
                                enrolledChittiesArray.length > 0
                              ) {
                                return enrolledChittiesArray.map(
                                  (chitty, index) => (
                                    <li key={index} className="py-1">
                                      {chitty.name}
                                    </li>
                                  )
                                );
                              } else {
                                return "Not Enrolled";
                              }
                            })()}
                          </div>
                        ) : (
                          "Not Enrolled"
                        )}
                      </td>
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
        </div>
      </div>
    </div>
  );
};

export default UserList;
