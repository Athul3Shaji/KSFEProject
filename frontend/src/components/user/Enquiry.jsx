import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { states, districts } from "./../data";
import {
  fetchAgents,
  fetchChitty,
  fetchEmployees,
  AddUserData,
  fetchUsers,
  fetchUserById,
  updateUserData,
} from "../services/services";

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    address: "",
    email: "",
    district: "",
    state: "",
    pin: "",
    reference: "",
    reference_detail: null,
    follow_up_date: "",
    chitties: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const dropdownRef = useRef(null);
  const [gridColumns, setGridColumns] = useState("grid-cols-2");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [staffOptions, setStaffOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [chittyOptions, setChittyOptions] = useState([]);
  const toastIdRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

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
    if (!formData.mobile_number)
      formErrors.mobile_number = "*Mobile is required";
    if (!formData.address) formErrors.address = "*Address is required";
    if (!formData.district) formErrors.district = "*District is required";
    if (!formData.state) formErrors.state = "*State is required";
    if (!formData.pin) formErrors.pin = "*PIN is required";
    if (!formData.reference) formErrors.reference = "*Reference is required";
    if (!formData.reference_detail)
      formErrors.reference_detail = "*Reference detail is required";
    if (!formData.notes) formErrors.notes = "*Notes is required";
    if (
      (formData.reference === "agent" ||
        formData.reference === "staff" ||
        formData.reference === "socialmedia" ||
        formData.reference === "direct") &&
      !formData.reference_detail
    )
      formErrors.reference_detail = "*Reference detail is required";
    if (formData.chitties.length === 0)
      formErrors.chitties = "*At least one chitty must be selected";

    // Validate mobile number
    if (formData.mobile_number) {
      if (!/^\d+$/.test(formData.mobile_number)) {
        formErrors.mobile_number = "*Mobile number must be a number";
      } else if (formData.mobile_number.length < 10) {
        formErrors.mobile_number = "*Mobile number must be at least 10 digits";
      }
    }

    // Validate PIN
    if (formData.pin) {
      if (!/^\d+$/.test(formData.pin)) {
        formErrors.pin = "*PIN must be a number";
      } else if (formData.pin.length < 6) {
        formErrors.pin = "*PIN must be at least 6 digits";
      }
    }
    if (formData.notes?.length > 200) {
      formErrors.notes = "*Notes cannot exceed 200 characters";
    }
    return formErrors;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name") {
      setLoadingSuggestions(true);

      try {
        // Fetch all users first
        const response = await fetchUsers();
        // Filter users based on the input value
        const filteredSuggestions = response
          .filter(
            (user) =>
              user.name.toLowerCase().includes(value.toLowerCase()) ||
              user.mobile_number.toLowerCase().includes(value.toLowerCase())
          )
          .map((user) => ({
            value: user.id,
            label: user.name,
            mobile: user.mobile_number,
          }));
        setSuggestions(filteredSuggestions);
      } catch (error) {
        showToast("Failed to fetch user suggestions.");
      } finally {
        setLoadingSuggestions(false);
      }
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
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

 const handleSuggestionSelect = async (selectedOption) => {
  if (selectedOption) {
    try {
      const user = await fetchUserById(selectedOption.value);

      // Map user.chitties to the correct format for react-select
      const selectedChitties = user.chitties?.map((chitty) => ({
        value: chitty.id,
        label: chitty.chitty_name,
      })) || [];
      
      // Correctly set the reference_detail value
      const referenceDetailOption = user.reference_detail ? {
        value: user.reference_detail,
        label: user.reference_detail,
      } : null;

      setFormData({
        id: user.id,
        name: user.name,
        mobile_number: user.mobile_number,
        address: user.address,
        email: user.email,
        district: user.district,
        state: user.state,
        pin: user.pin,
        reference: user.reference,
        reference_detail:referenceDetailOption, // Set the correct value here
        follow_up_date:user.follow_up_date,
        chitties: selectedChitties,
        notes: user.notes,
      });
      
      const stateIndex = states.indexOf(user.state);
      setAvailableDistricts(districts[stateIndex] || []);
      setSuggestions([]); // Clear suggestions after selection
    } catch (error) {
      showToast("Failed to fetch user details.");
    }
  }
};


  const handleReferenceChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, reference: value, reference_detail: null });

    // Clear reference-related errors
    if (errors.reference) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        reference: "",
      }));
    }
    if (errors.reference_detail) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        reference_detail: "",
      }));
    }
  };

  const handleChittyChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      chitties: selectedOptions || [],
    }));
  };  

  const handleReferenceDetailChange = (option) => {
    setFormData((prevState) => ({
      ...prevState,
      reference_detail: option || null,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
  
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitted(true);
      try {
        const submissionData = {
          ...formData,
          chitties: formData.chitties.map(chitty => chitty.value), // Save only the IDs
          reference_detail: formData.reference_detail?.label,
        };
        if (formData.id) {
          await updateUserData(formData.id, submissionData);
          showToast("User updated successfully!");
        } else {
          await AddUserData(submissionData);
          showToast("User added successfully!");
        }
        setFormData({
          name: "",
          mobile_number: "",
          address: "",
          email: "",
          district: "",
          state: "",
          pin: "",
          reference: "",
          reference_detail: null,
          follow_up_date: "",
          chitties: [],
          notes: "",
        });
        setSuggestions([]);
        setErrors({});
      } catch (error) {
        showToast("Failed to submit form.");
      }
    } else {
      setErrors(formErrors);
    }
  };
  
  
  

  return (
    <>
      <div className="flex justify-center items-start min-h-screen mb-2 bg-neutral-100 pt-4">
        <div className="container mx-auto px-4 lg:px-20">
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
                  {loadingSuggestions}
                  {suggestions.length > 0 && (
                    <div className="absolute bg-white border border-gray-300 rounded-lg mt-2 w-1/4 z-10">
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.value}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                          {suggestion.label} ({suggestion.mobile})
                        </div>
                      ))}
                    </div>
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
                    maxLength={12}
                    className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                      errors.mobile_number ? "border-red-500" : ""
                    }`}
                    type="text"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Mobile*"
                    disabled={!!formData.id} 
                  />
                  {errors.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobile_number}
                    </p>
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.district}
                    </p>
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
                    maxLength={6}
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reference}
                    </p>
                  )}
                </div>

                {formData.reference && (
                  <div>
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="reference_detail"
                    >
                      Reference Detail<sup className="text-red-500">*</sup>
                    </label>
                    <Select
                      value={formData?.reference_detail}
                      onChange={handleReferenceDetailChange}
                      options={
                        formData.reference === "agent"
                          ? agentOptions
                          : formData.reference === "staff"
                          ? staffOptions
                          : formData.reference === "socialmedia"
                          ? [
                              { value: "Facebook", label: "Facebook" },
                              { value: "Whatsapp", label: "Whatsapp" },
                              { value: "Instagram", label: "Instagram" },
                              {
                                value: "KSFE Powerapp",
                                label: "KSFE Powerapp",
                              },
                              { value: "Email", label: "Email" },
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
                        errors.reference_detail ? "border-red-500" : ""
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
                          borderColor: errors.reference_detail
                            ? "#f56565" // Tailwind `border-red-500`
                            : state.isFocused
                            ? "#63b3ed" // Tailwind `focus:border-blue-400`
                            : "#e2e8f0", // Tailwind `border-gray-300`
                          boxShadow: state.isFocused
                            ? "0 0 0 3px rgba(66, 153, 225, 0.5)"
                            : null, // Tailwind `focus:shadow-outline`
                          "&:hover": {
                            borderColor: errors.reference_detail
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
                    {errors.reference_detail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.reference_detail}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="pin"
                  >
                    Follow-Up Date
                  </label>
                  <input
                    maxLength={6}
                    className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                      errors.follow_up_date ? "border-red-500" : ""
                    }`}
                    type="date"
                    name="follow_up_date"
                    value={formData.follow_up_date?.slice(0, 10) || ""}
                    onChange={handleChange}
                    placeholder="Follow-up date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.follow_up_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.follow_up_date}
                    </p>
                  )}
                </div>
                <div className="col-span-2 row-span-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="chitties"
                  >
                    Chitties<sup className="text-red-500">*</sup>
                  </label>
                  <Select
                    isMulti
                    value={formData.chitties}
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
                        borderColor: errors.reference_detail
                          ? "#f56565" // Tailwind `border-red-500`
                          : state.isFocused
                          ? "#63b3ed" // Tailwind `focus:border-blue-400`
                          : "#e2e8f0", // Tailwind `border-gray-300`
                        boxShadow: state.isFocused
                          ? "0 0 0 3px rgba(66, 153, 225, 0.5)"
                          : null, // Tailwind `focus:shadow-outline`
                        "&:hover": {
                          borderColor: errors.reference_detail
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.chitties}
                    </p>
                  )}
                </div>
                <div className="col-span-2 row-span-2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="notes"
                  >
                    Notes<sup className="text-red-500">*</sup>
                  </label>
                  <input
                    className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline h-20 ${
                      errors.notes ? "border-red-500" : ""
                    }`}
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="notes..."
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                  )}
                </div>

                <div className="col-span-2 w-full flex justify-center mt-5">
                  <button
                    type="submit"
                    className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-[#7fb715] to-[#066769] text-gray-100 p-3
                   rounded-lg w-full max-w-xs focus:outline-none focus:shadow-outline"
                  >
                    {formData.id ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="top-center" limit={1} />
      </div>
    </>
  );
};

export default Enquiry;
