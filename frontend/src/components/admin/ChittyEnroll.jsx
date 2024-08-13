import React, { useState } from "react";
import Navbar from "../Navbar";
import Select from "react-select";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdPictureAsPdf } from "react-icons/md";

const chittiesList = [
  { label: "All", value: "ALL" },
  {
    label: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    value: "KGC-S1",
  },
  {
    label:
      "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    value: "KGC-S2",
  },
  {
    label:
      "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    value: "KGC-S3",
  },
  // Add more chitties here
];

const ChittyEnroll = () => {
  const [selectedChitty, setSelectedChitty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([
    {
      id: "E001",
      name: "John Doe",
      mobile: "1234567890",
      email: "john.doe@example.com",
      chitty: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    },
    {
      id: "E002",
      name: "Jane Smith",
      mobile: "0987654321",
      email: "jane.smith@example.com",
      chitty: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    },
    {
      id: "E003",
      name: "Michael Johnson",
      mobile: "1122334455",
      email: "michael.johnson@example.com",
      chitty: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    },
    {
      id: "E004",
      name: "Emily Davis",
      mobile: "2233445566",
      email: "emily.davis@example.com",
      chitty: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    },
    {
      id: "E005",
      name: "Chris Brown",
      mobile: "3344556677",
      email: "chris.brown@example.com",
      chitty: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    },
    {
      id: "E006",
      name: "Jessica Williams",
      mobile: "4455667788",
      email: "jessica.williams@example.com",
      chitty: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    },
    {
      id: "E007",
      name: "Matthew Jones",
      mobile: "5566778899",
      email: "matthew.jones@example.com",
      chitty: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    },
    {
      id: "E008",
      name: "Olivia Garcia",
      mobile: "6677889900",
      email: "olivia.garcia@example.com",
      chitty: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    },
    {
      id: "E009",
      name: "Daniel Martinez",
      mobile: "7788990011",
      email: "daniel.martinez@example.com",
      chitty: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    },
    {
      id: "E010",
      name: "Sophia Wilson",
      mobile: "8899001122",
      email: "sophia.wilson@example.com",
      chitty: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    },
    {
      id: "E011",
      name: "Andrew Lee",
      mobile: "9900112233",
      email: "andrew.lee@example.com",
      chitty: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    },
    {
      id: "E012",
      name: "Isabella Anderson",
      mobile: "0011223344",
      email: "isabella.anderson@example.com",
      chitty: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    },
  ]);

  const employeesPerPage = 7;

  const filteredEmployees = employees
    .filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((employee) =>
      selectedChitty && selectedChitty.value !== "ALL"
        ? employee.chitty === selectedChitty.label
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
      head: [["Employee ID", "Name", "Mobile", "Email"]],
      body: filteredEmployees.map((emp) => [
        emp.id,
        emp.name,
        emp.mobile,
        emp.email,
      ]),
    });
    doc.save("chitty_enrollment_list.pdf");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

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
                className="flex-1 text-lg"
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
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No records found
            </div>
          ) : (
            <>
              <table className="w-full text-lg text-left text-gray-700">
                <thead className="text-xs text-gray-100 uppercase bg-gradient-to-r from-[#7fb715] to-[#066769]">
                  <tr>
                    <th scope="col" className="px-2 py-3">
                      Employee ID
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
                  {currentEmployees.map((employee, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? "bg-white border-b"
                          : "bg-gray-200 border-b"
                      }
                    >
                      <td className="px-2 py-3 text-gray-900">{employee.id}</td>
                      <td className="px-6 py-3">{employee.name}</td>
                      <td className="px-7 py-3">{employee.mobile}</td>
                      <td className="px-11 py-3">{employee.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {filteredEmployees.length > employeesPerPage && (
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
