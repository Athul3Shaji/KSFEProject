import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import logo from "../../assets/ksfe-logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { states, districts } from "./../data";
import { fetchAgents, fetchChitty, fetchEmployees } from "../services/services";

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    email: "",
    district: "",
    state: "",
    pin: "",
    reference: "",
    referenceDetail: null, // Update to handle object
    chitties: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const dropdownRef = useRef(null);
  const [gridColumns, setGridColumns] = useState("grid-cols-2");

  const [staffOptions, setStaffOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [chittyOptions, setChittyOptions] = useState([]);

  const navigate = useNavigate();
  const toastIdRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const userDetailsList = [
  {
    address: "Hil",
    chitties: [6, 7, 10],
    district: "Ernakulam",
    email: "vh@gmail.com",
    mobile: "1234555555",
    name: "Yadhu",
    pin: "465675",
    reference: "agent",
    referenceDetail: "David Green",
    state: "Kerala",
  },
  {
    address: "Maple Street",
    chitties: [2, 3, 5],
    district: "Kottayam",
    email: "maple@gmail.com",
    mobile: "9876543210",
    name: "John Doe",
    pin: "682020",
    reference: "staff",
    referenceDetail: "Jane Smith",
    state: "Kerala",
  },
  {
    address: "Pine Avenue",
    chitties: [1, 4, 8],
    district: "Thrissur",
    email: "pine@gmail.com",
    mobile: "8765432109",
    name: "Alice Johnson",
    pin: "680003",
    reference: "socialmedia",
    referenceDetail: "Facebook Ad",
    state: "Kerala",
  },
  {
    address: "Oak Road",
    chitties: [9, 11, 12],
    district: "Kozhikode",
    email: "oak@gmail.com",
    mobile: "7654321098",
    name: "Bob Brown",
    pin: "673001",
    reference: "direct",
    referenceDetail: "Walk-in",
    state: "Kerala",
  },
  {
    address: "Cedar Lane",
    chitties: [13, 14, 15],
    district: "Alappuzha",
    email: "cedar@gmail.com",
    mobile: "6543210987",
    name: "Carol White",
    pin: "688006",
    reference: "agent",
    referenceDetail: "Michael Scott",
    state: "Kerala",
  },
  // Add more user objects as needed
];

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetchEmployees();
        const staffList = response?.map((staff) => ({
          value: staff.id,
          label: staff.employee_name,
        }));
        setStaffOptions(staffList);
      } catch (error) {
        showToast("Failed to fetch staff list.");
      }
    };

    const fetchAgentsList = async () => {
      try {
        const response = await fetchAgents();
        const agentsList = response?.map((agent) => ({
          value: agent.id,
          label: agent.agent_name,
        }));
        setAgentOptions(agentsList);
      } catch (error) {
        showToast("Failed to fetch agents list.");
      }
    };

    const fetchChittiesList = async () => {
      try {
        const response = await fetchChitty();
        const chittiesList = response?.map((chitty) => ({
          value: chitty.id,
          label: chitty.chitty_name,
        }));
        setChittyOptions(chittiesList);
      } catch (error) {
        showToast("Failed to fetch chitties list.");
      }
    };

    fetchStaff();
    fetchAgentsList();
    fetchChittiesList();
  }, []);

  const showToast = (message) => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }
    toastIdRef.current = toast(message);
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "*Name is required";
    if (!formData.mobile) formErrors.mobile = "*Mobile is required";
    if (!formData.address) formErrors.address = "*Address is required";
    if (!formData.district) formErrors.district = "*District is required";
    if (!formData.state) formErrors.state = "*State is required";
    if (!formData.pin) formErrors.pin = "*PIN is required";
    if (!formData.reference) formErrors.reference = "*Reference is required";
    if (
      (formData.reference === "agent" || formData.reference === "staff" ||
      formData.reference === "socialmedia" || formData.reference === "direct") &&
      !formData.referenceDetail
    )
      formErrors.referenceDetail = "*Reference detail is required";
    if (formData.chitties.length === 0)
      formErrors.chitties = "*At least one chitty must be selected";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Clear error for the specific field being corrected
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  
    if (name === "state") {
      const stateIndex = states.indexOf(value);
      setAvailableDistricts(districts[stateIndex] || []);
      setFormData((prevState) => ({
        ...prevState,
        district: "",
      }));
    }
  };
  
  const handleReferenceChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, reference: value, referenceDetail: null });
  
    // Clear reference-related errors
    if (errors.reference) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        reference: "",
      }));
    }
    if (errors.referenceDetail) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        referenceDetail: "",
      }));
    }
  };
  
  const handleChittyChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      chitties: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleReferenceDetailChange = (option) => {
    setFormData((prevState) => ({
      ...prevState,
      referenceDetail: option || null, // Set the selected option object
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      const submissionData = {
        ...formData,
        referenceDetail: formData.referenceDetail?.label 
      }

      console.log(submissionData, "----------------");
      showToast("Details added successfully!");
      
      setIsSubmitted(true);
      setFormData({
        name: "",
        mobile: "",
        address: "",
        email: "",
        district: "",
        state: "",
        pin: "",
        reference: "",
        referenceDetail: null,
        chitties: [],
      });
      setErrors({}); // Clear errors
    } else {
      setErrors(formErrors);
    }
  };
  

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-start min-h-screen mb-2 bg-neutral-100 pt-4">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-grow justify-center">
            <img className="w-32 h-32" src={logo} alt="KSFE Logo" />
          </div>
          <div ref={dropdownRef} className="relative flex-shrink-0">
            <FaUserCircle
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-4xl cursor-pointer"
            />
            user
            {showDropdown && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full p-4 md:px-8 lg:pl-16 lg:pr-16 mx-auto bg-neutral-200 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-2 ml-10">
            <h1 className="font-bold uppercase text-4xl">User Details</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="name"
                >
                  Name<sup className="text-red-500">*</sup>
                </label>
                <input
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name*"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="mobile"
                >
                  Mobile<sup className="text-red-500">*</sup>
                </label>
                <input
                maxLength={10}
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.mobile ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile*"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="address"
                >
                  Address<sup className="text-red-500">*</sup>
                </label>
                <input
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address*"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="state"
                >
                  State<sup className="text-red-500">*</sup>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.state ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="district"
                >
                  District<sup className="text-red-500">*</sup>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.district ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="pin"
                >
                  PIN<sup className="text-red-500">*</sup>
                </label>
                <input
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.pin ? "border-red-500" : ""
                  }`}
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="PIN*"
                />
                {errors.pin && (
                  <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="reference"
                >
                  Reference<sup className="text-red-500">*</sup>
                </label>
                <select
                  name="reference"
                  value={formData.reference}
                  onChange={handleReferenceChange}
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.reference ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Reference</option>
                  <option value="agent">Agent</option>
                  <option value="staff">Staff</option>
                  <option value="socialmedia">Social Media</option>
                  <option value="direct">Direct</option>
                </select>
                {errors.reference && (
                  <p className="text-red-500 text-sm mt-1">{errors.reference}</p>
                )}
              </div>

              {formData.reference && (
                <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="referenceDetail"
                >
                  Reference Detail<sup className="text-red-500">*</sup>
                </label>
                <Select
                  value={formData.referenceDetail}
                  onChange={handleReferenceDetailChange}
                  options={
                    formData.reference === "agent"
                      ? agentOptions
                      : formData.reference === "staff"
                      ? staffOptions
                      : formData.reference === "socialmedia"
                      ? [
                          { value: "Facebook", label: "Facebook" },
                          { value: "Twitter", label: "Twitter" },
                          { value: "Instagram", label: "Instagram" },
                          { value: "LinkedIn", label: "LinkedIn" },
                        ]
                      : formData.reference === "direct"
                      ? [
                          { value: "visit", label: "Visit" },
                          { value: "call", label: "Call" },
                        ]
                      : []
                  }
                  placeholder="Select Detail"
                  className={`basic-single ${
                    errors.referenceDetail ? "border-red-500" : ""
                  }`}
                  classNamePrefix="select"
                  isClearable
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "#f7fafc", // Tailwind `bg-gray-100`
                      color: "#1a202c", // Tailwind `text-gray-900`
                      padding: "0.3rem", // Tailwind `p-3`
                      borderRadius: "0.75rem", // Tailwind `rounded-lg`
                      borderColor: errors.referenceDetail
                        ? "#f56565" // Tailwind `border-red-500`
                        : state.isFocused
                        ? "#63b3ed" // Tailwind `focus:border-blue-400`
                        : "#e2e8f0", // Tailwind `border-gray-300`
                      boxShadow: state.isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : null, // Tailwind `focus:shadow-outline`
                      "&:hover": {
                        borderColor: errors.referenceDetail
                          ? "#f56565" // Tailwind `hover:border-red-500`
                          : "#a0aec0", // Tailwind `hover:border-gray-400`
                      },
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
                      color: state.isSelected ? "#ffffff" : "#1a202c", // Tailwind `text-white` or `text-gray-900`
                    }),
                  }}
                />
                {errors.referenceDetail && (
                  <p className="text-red-500 text-sm mt-1">{errors.referenceDetail}</p>
                )}
              </div>
              
              )}

              <div className="col-span-2 row-span-2">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="chitties"
                >
                  Chitties<sup className="text-red-500">*</sup>
                </label>
                <Select
                  isMulti
                  value={formData.chitties.map((chittyId) =>
                    chittyOptions.find((option) => option.value === chittyId)
                  )}
                  onChange={handleChittyChange}
                  options={chittyOptions}
                  placeholder="Select Chitties"
                  className={`basic-multi-select ${
                    errors.chitties ? "border-red-500" : ""
                  }`}
                  classNamePrefix="select"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "#f7fafc", // Tailwind `bg-gray-100`
                      color: "#1a202c", // Tailwind `text-gray-900`
                      padding: "0.3rem", // Tailwind `p-3`
                      borderRadius: "0.75rem", // Tailwind `rounded-lg`
                      borderColor: errors.referenceDetail
                        ? "#f56565" // Tailwind `border-red-500`
                        : state.isFocused
                        ? "#63b3ed" // Tailwind `focus:border-blue-400`
                        : "#e2e8f0", // Tailwind `border-gray-300`
                      boxShadow: state.isFocused ? "0 0 0 3px rgba(66, 153, 225, 0.5)" : null, // Tailwind `focus:shadow-outline`
                      "&:hover": {
                        borderColor: errors.referenceDetail
                          ? "#f56565" // Tailwind `hover:border-red-500`
                          : "#a0aec0", // Tailwind `hover:border-gray-400`
                      },
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
                      color: state.isSelected ? "#ffffff" : "#1a202c", // Tailwind `text-white` or `text-gray-900`
                    }),
                  }}
                />
                {errors.chitties && (
                  <p className="text-red-500 text-sm mt-1">{errors.chitties}</p>
                )}
              </div>

              <div className="col-span-2 w-full flex justify-center mt-5">
                <button
                  type="submit"
                  className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-[#7fb715] to-[#066769] text-gray-100 p-3
                   rounded-lg w-full max-w-xs focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center"/>
    </div>
  );
};

export default Enquiry;
