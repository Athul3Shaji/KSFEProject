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
  updateEnrollment,
} from "../services/services";
import { toast, ToastContainer } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsBookmarkPlusFill } from "react-icons/bs";

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
    loadUsers();
  }, [selectedChitty]);

  const isChittyEnrolled = (chittyId) => {
    // Check if enrolled_chitties is a valid array before using .some()
    return (
      Array.isArray(chittySet.enrolled_chitties) &&
      chittySet.enrolled_chitties.some(
        (enrolledChitty) => enrolledChitty.id === chittyId
      )
    );
  };

  // Function to handle status change (enroll/unroll)
  const handleStatusChange = async (userId, chittyId, newStatus) => {
    const chittyChange = {
      user_id: userId,
      chitty_id: chittyId,
      enroll_status: newStatus,
    };

    const action = newStatus === 1 ? "Enroll" : "Unroll";

    const confirmChange = window.confirm(
      `Are you sure you want to ${action} this chitty?`
    );

    if (confirmChange) {
      try {
        const response = await updateEnrollment(chittyChange);
        toast.success(
          `Chitty ID: ${chittyId} has been ${
            newStatus === 1 ? "Enrolled" : "Unrolled"
          } successfully.`
        );
        await refreshModalData(userId);
      } catch (error) {
        toast.error(`Failed to ${action} the chitty. Please try again later.`);
      }
    }
  };

  // Function to refresh modal data after enrollment status change
  const refreshModalData = async (userId) => {
    try {
      const updatedUser = await fetchUserById(userId);
      setChittySet(updatedUser || []);
    } catch (error) {
      toast.error("Error refreshing user data.");
    }
  };

  // Function to toggle modal and refresh user list on close
  const toggleModal = (id = null) => {
    if (id) {
      fetchUserById(id)
        .then((chit) => {
          setChittySet(chit || []);
          setIsModalOpen(true);
        })
        .catch((error) => {
          toast.error("Error fetching chitties of user", { toastId: "1021" });
        });
    } else {
      setIsModalOpen(!isModalOpen);
      if (isModalOpen) {
        loadUsers(); // Ensure `loadUsers` is available in the scope
      }
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
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `${selectedChitty.label}`,
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: 'center' }
    );
    
    const body = sortedUsers.map((user) => {
      let enrolledChittiesDisplay = "Not Enrolled";
      try {
        const enrolledChittiesArray = JSON.parse(user.enrolled_chitties);
        if (
          Array.isArray(enrolledChittiesArray) &&
          enrolledChittiesArray.length > 0
        ) {
          enrolledChittiesDisplay = enrolledChittiesArray
            .map((chitty) => `• ${chitty.name}`)
            .join("\n");
        }
      } catch (e) {
        console.error("Failed to parse enrolled_chitties:", e);
      }
  
      return [
        user.id,
        user.name,
        user.mobile_number,
        user.email,
        user.reference,
        user.reference_detail,
        enrolledChittiesDisplay,
      ];
    });
  
    doc.autoTable({
      head: [
        [
          "ID",
          "Name",
          "Mobile",
          "Email",
          "Reference",
          "Reference Detail",
          "Enrolled Chitties",
        ],
      ],
      body: body,
      headStyles: {
        fillColor: [169, 169, 169],
        textColor: [0, 0, 0],
        halign: 'center',
      },
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle',
        halign: 'left',
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      margin: { top: 30 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });
  
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const timestamp = `${day}${month}${year}`;
  
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
                placeholder="name or mobile"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={handleExportPDF}
                className={`flex items-center justify-center bg-[#252eb1] text-gray-100 font-semibold py-2 px-8 w-44 rounded-lg hover:opacity-90 ${
                  !selectedChitty ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!selectedChitty}
                title={!selectedChitty ? 'Please select a chitty to export' : ''}
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
                
              />
            )}
            <div className="w-full md:w-48">
              <DatePicker
                selected={followUpDate}
                showIcon
                isClearable
                onChange={(date) => setFollowUpDate(date)}
                className="w-full custom-input text-sm text-center bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                placeholderText=" Date "
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
                    <th scope="col" className="px-4 text-center py-3">
                      Reference Detail
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Follow-up Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Enrolled In
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
                      <td className="px-4 py-3">{user?.reference_detail}</td>

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
                          <div className="text-center">
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
                                    <li key={index} className="py-1 text-left">
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
                      <td className="px-4 text-center text-blue-700 py-3 text">
                        <button
                          onClick={() => toggleModal(user?.id)}
                          className="flex "
                        >
                          Enroll
                          <BsBookmarkPlusFill className="ml-1 mt-1" />
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
                  {chittySet.chitties.map((chitty) => {
                    const enrolled = isChittyEnrolled(chitty.id);

                    return (
                      <div
                        key={chitty.id}
                        className="border-b border-neutral-300 pb-2 pt-2"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-gray-700 text-sm">
                            {chitty.id}
                          </label>
                          <label className="text-gray-700 text-sm">
                            {chitty.chitty_name}
                          </label>

                          <div className="flex items-center">
                            <a
                              onClick={() =>
                                handleStatusChange(
                                  chittySet.id,
                                  chitty.id,
                                  enrolled ? 0 : 1
                                )
                              }
                              className={`px-6 py-2 min-w-[120px] text-center text-white border rounded focus:outline-none focus:ring ${
                                enrolled
                                  ? "bg-blue-600 border-blue-600 hover:bg-transparent hover:text-blue-600 active:text-violet-500"
                                  : "bg-gray-300 text-gray-700 border-gray-300 hover:bg-transparent hover:text-gray-700 active:text-gray-500"
                              }`}
                              href="#"
                            >
                              {enrolled ? "Enrolled" : "Enroll"}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => toggleModal()} // Close modal
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
