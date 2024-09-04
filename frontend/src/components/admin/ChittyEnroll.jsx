import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdPictureAsPdf } from "react-icons/md";
import {
  fetchAgents,
  fetchChitty,
  fetchEmployees,
  fetchUsers,
  fetchUsersByFilter,
  fetchUserById,
} from "../services/services";
import { toast, ToastContainer } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ChittyEnroll = () => {
  const [chittiesList, setChittiesList] = useState([]);
  const [selectedChitty, setSelectedChitty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedReference, setSelectedReference] = useState(null);
  const [referenceDetailOptions, setReferenceDetailOptions] = useState([]);
  const [selectedReferenceDetail, setSelectedReferenceDetail] = useState(null);
  const [followUpDate, setFollowUpDate] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chittySet, setChittySet] = useState(null);

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

  const handleStatusChange = (userId, chittyId, newStatus) => {
    console.log(userId, chittyId, newStatus);

    // Determine the action based on the newStatus
    const action = newStatus === 1 ? "Enroll" : "Unroll";

    // Confirmation message
    const confirmChange = window.confirm(
      `Are you sure you want to ${action} this chitty?`
    );

    if (confirmChange) {
      // Update the status
      console.log(
        `Chitty ID: ${chittyId} has been ${
          newStatus === 1 ? "Enrolled" : "Unrolled"
        }.`
      );
    } else {
      console.log("Action cancelled.");
    }
  };

  const toggleModal = (id = null) => {
    console.log(id, "idddddddddddddddddd");

    if (id) {
      fetchUserById(id)
        .then((chit) => {
          setChittySet(chit || []);
          console.log(chit);

          setIsModalOpen(true);
        })
        .catch((error) => {
          console.error("Error fetching user by ID:", error);
          toast.error("Error fetching chitties of user", { toastId: "1021" });
        });
    } else {
      // If no ID is provided, simply toggle the modal state
      setIsModalOpen(!isModalOpen);
    }
  };

  const usersPerPage = 7;
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.reference.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      selectedChitty && selectedChitty.value !== "ALL"
        ? user.chitties.includes(Number(selectedChitty.value))
        : true
    )
    .filter((user) =>
      selectedReference && selectedReference.value !== "all"
        ? user.reference.toLowerCase() === selectedReference.value.toLowerCase()
        : true
    )
    .filter((user) =>
      selectedReferenceDetail &&
      selectedReferenceDetail.value.toLowerCase() !== "all"
        ? user.reference_detail === selectedReferenceDetail.value
        : true
    )
    .filter((user) => {
      if (followUpDate) {
        const userDate = new Date(user.follow_up_date).setHours(0, 0, 0, 0);
        const filterDate = new Date(followUpDate).setHours(0, 0, 0, 0);
        return userDate === filterDate;
      }
      return true;
    });

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
      head: [
        [
          "ID",
          "Name",
          "Mobile",
          "Email",
          "District",
          "State",
          "Reference",
          "Reference Detail",
        ],
      ],
      body: sortedUsers.map((user) => [
        user.id,
        user.name,
        user.mobile_number,
        user.email,
        user.district,
        user.state,
        user.reference,
        user.reference_detail,
      ]),
    });
    // Generate current date and time in DDMMYYYY_HHMM format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = now.getFullYear();
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
  const handleReferenceChange = async (selectedOption) => {
    setSelectedReferenceDetail(null);
    setSelectedReference(selectedOption);

    if (selectedOption.value === "socialmedia") {
      setReferenceDetailOptions([
        { value: "Facebook", label: "Facebook" },
        { value: "Whatsapp", label: "Whatsapp" },
        { value: "Instagram", label: "Instagram" },
        { value: "KSFE-Powerapp", label: "KSFE Powerapp" },
        { value: "Email", label: "Email" },
      ]);
    } else if (selectedOption.value === "direct") {
      setReferenceDetailOptions([
        { value: "Visit", label: "Visit" },
        { value: "Call", label: "Call" },
      ]);
    } else if (selectedOption.value === "staff") {
      try {
        const employees = await fetchEmployees();
        setReferenceDetailOptions(
          employees.map((employee) => ({
            value: employee.employee_name,
            label: employee.employee_name,
          }))
        );
      } catch (error) {
        toast.error("Error fetching staff details.", { toastId: "123" });
      }
    } else if (selectedOption.value === "agent") {
      try {
        const agents = await fetchAgents();
        setReferenceDetailOptions(
          agents.map((agent) => ({
            value: agent.agent_name,
            label: agent.agent_name,
          }))
        );
      } catch (error) {
        toast.error("Error fetching agent details.", { toastId: "124" });
      }
    } else {
      setReferenceDetailOptions([]);
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
  }, [searchTerm, selectedChitty, selectedReference]);

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-90px)] bg-white flex flex-col items-center pt-10 pb-3 px-4">
        <div className="w-full md:w-3/4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Chitty Enrollment
          </h1>
          <div className="flex flex-col md:flex-row w-full items-center mb-4">
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
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center bg-[#252eb1] text-gray-100 font-semibold py-2 px-8 w-44 rounded-lg hover:opacity-90"
              >
                Export <MdPictureAsPdf className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full items-center space-x-4">
            <Select
              id="chitty-filter "
              options={chittiesList}
              onChange={handleChittyChange}
              className="flex-1 text-sm custom-select"
              placeholder="Select a Chitty"
              value={selectedChitty}
            />
            <Select
              id="reference-filter"
              options={[
                { value: "all", label: "All" },
                { value: "direct", label: "Direct" },
                { value: "agent", label: "Agent" },
                { value: "staff", label: "Staff" },
                { value: "socialmedia", label: "Social Media" },
              ]}
              onChange={handleReferenceChange}
              className="w-full rounded-2xl md:w-48 text-sm"
              placeholder="Reference"
              value={selectedReference}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "#f7fafc", // Tailwind `bg-gray-100`
                  color: "#1a202c", // Tailwind `text-gray-900`
                  padding: "0.3rem", // Tailwind `p-3`
                  borderRadius: "1.75rem", // Tailwind `rounded-lg`
                  boxShadow: state.isFocused
                    ? "0 0 0 3px rgba(66, 153, 225, 0.5)"
                    : null, // Tailwind `focus:shadow-outline`
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: "0.75rem", // Tailwind `rounded-lg`
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Tailwind `shadow-sm`
                  backgroundColor: "#ffffff",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3182ce" // Tailwind `bg-blue-500`
                    : state.isFocused
                    ? "#ebf8ff" // Tailwind `bg-blue-100`
                    : "#ffffff", // Tailwind `bg-white`
                  color: state.isSelected ? "#ffffff" : "#1a202c",
                  paddingLeft: "0.75rem",
                }),
              }}
            />
            {selectedReference && selectedReference.value !== "all" && (
              <Select
                id="reference-detail-filter"
                options={referenceDetailOptions}
                className="w-full rounded-2xl md:w-56 text-sm"
                placeholder="Reference Detail"
                value={selectedReferenceDetail}
                onChange={(selectedOption) =>
                  setSelectedReferenceDetail(selectedOption)
                }
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: "#f7fafc", // Tailwind `bg-gray-100`
                    color: "#1a202c", // Tailwind `text-gray-900`
                    padding: "0.3rem", // Tailwind `p-3`
                    borderRadius: "1.75rem", // Tailwind `rounded-lg`
                    boxShadow: state.isFocused
                      ? "0 0 0 3px rgba(66, 153, 225, 0.5)"
                      : null, // Tailwind `focus:shadow-outline`
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "0.75rem", // Tailwind `rounded-lg`
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Tailwind `shadow-sm`
                    backgroundColor: "#ffffff", // Tailwind `bg-white`
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#3182ce" // Tailwind `bg-blue-500`
                      : state.isFocused
                      ? "#ebf8ff" // Tailwind `bg-blue-100`
                      : "#ffffff", // Tailwind `bg-white`
                    color: state.isSelected ? "#ffffff" : "#1a202c",
                  }),
                }}
              />
            )}
            <div className="w-full md:w-48">
              <DatePicker
                selected={followUpDate}
                showIcon
                isClearable
                onChange={(date) => setFollowUpDate(date)}
                className="w-full custom-input text-sm text-center bg-gray-200 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                placeholderText="↕ Date "
                dateFormat="MMMM d, yyyy"
              />
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
                      Enroll
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Action
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
                        {user?.id}
                      </td>
                      <td className="px-4 py-3">{user?.name}</td>
                      <td className="px-4 py-3">{user?.mobile_number}</td>
                      <td className="px-4 py-3">{user?.reference}</td>
                      <td className="px-4 text-center py-3">
                        {user?.reference_detail}
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
                        {user.enrolled_chitties === null
                          ? "Not Enrolled"
                          : "Enrolled"}
                      </td>
                      <td className="px-4 text-center text-blue-700 py-3 text">
                        <button
                          onClick={() => toggleModal(user?.id)}
                          className=""
                        >
                          Enroll
                        </button>
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
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => toggleModal()} // Click outside content closes modal
          >
            <div
              className="bg-white pb-2  w-full max-w-3xl max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
            >
              <h2 className="text-xl bg-gray-700 border-gray-500 border font-bold mb-4 text-white text-center p-4 ">
                Enrolled Chitties
              </h2>
              <div className="flex-1 overflow-y-auto mb-6 pr-5 pl-4 custom-scrollbar">
                <ul>
                  {chittySet.chitties.map((chitty) => (
                    <div
                      key={chitty.id}
                      className="border-b border-neutral-300 pb-2 pt-2"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-gray-700 text-sm ">
                          {chitty.id}
                        </label>
                        <label className="text-gray-700 text-sm ">
                          {chitty.chitty_name}
                        </label>

                        <div className="flex items-center">
                          <a
                            onClick={() =>
                              handleStatusChange(
                                chittySet.id,
                                chitty.id,
                                chitty.enrollStatus === 1
                                  ? (chitty.enrollStatus = 0)
                                  : (chitty.enrollStatus = 1)
                              )
                            }
                            className={`px-6 py-2 min-w-[120px] text-center text-white border rounded focus:outline-none focus:ring ${
                              chitty.enrollStatus === 1
                                ? "bg-violet-600 border-violet-600 hover:bg-transparent hover:text-violet-600 active:text-violet-500"
                                : "bg-gray-300 text-gray-700 border-gray-300 hover:bg-transparent hover:text-gray-700 active:text-gray-500"
                            }`}
                            href="#"
                          >
                            {chitty.enrollStatus === 1 ? "Enrolled" : "Enroll"}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => toggleModal()} // Close modal
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" limit={1} />
    </>
  );
};

export default ChittyEnroll;
