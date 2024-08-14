import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import logo from "../../assets/ksfe-logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { states, districts } from "./../data"; // Importing states and districts

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
    referenceDetail: "",
    chitties: [],
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const dropdownRef = useRef(null);
  const [gridColumns, setGridColumns] = useState("grid-cols-2"); 

  //handle the signout modal
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

  const chittyOptions = [
    {
      value: "KGC-S1",
      label:
        "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)",
    },
    {
      value: "KGC-S2",
      label:
        "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)",
    },
    {
      value: "KGC-S3",
      label:
        "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)",
    },
  ];

  const staffOptions = [
    { value: "", label: "Select Staff" },
    { value: "John", label: "John Doe" },
    { value: "James", label: "James Frence" },
    { value: "Alice", label: "Alice George" },
  ];

  const agentOptions = [
    { value: "", label: "Select Agents" },
    { value: "John", label: "John Doe" },
    { value: "James", label: "James Frence" },
    { value: "Alice", label: "Alice George" },
  ];

  const socialMedia = [
    { value: "", label: "Select social media" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
  ];

  const directOptions = [
    { value: "", label: "Select direct method" },
    { value: "visit", label: "Visit" },
    { value: "call", label: "Call" },
  ];

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "*Name is required";
    if (!formData.mobile) formErrors.mobile = "*Mobile is required";
    if (!formData.address) formErrors.address = "*Address is required";
    if (!formData.district) formErrors.district = "*District is required";
    if (!formData.state) formErrors.state = "*State is required";
    if (!formData.pin) formErrors.pin = "*PIN is required";
    if (!formData.reference) formErrors.reference = "*Reference is required";
    if (formData.reference === "agent" && !formData.referenceDetail)
      formErrors.referenceDetail = "*Agent name is required";
    if (formData.reference === "staff" && !formData.referenceDetail)
      formErrors.referenceDetail = "*Staff selection is required";
    if (formData.reference === "socialmedia" && !formData.referenceDetail)
      formErrors.referenceDetail = "*Social media platform is required";
    if (formData.reference === "direct" && !formData.referenceDetail)
      formErrors.referenceDetail = "*Direct contact method is required";
    if (formData.chitties.length === 0)
      formErrors.chitties = "*At least one chitty must be selected";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update districts based on selected state
    if (name === "state") {
      const stateIndex = states.indexOf(value);
      setAvailableDistricts(districts[stateIndex] || []);
      setFormData((prevState) => ({
        ...prevState,
        district: "", // Reset district when state changes
      }));
    }
  };

  const handleReferenceChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, reference: value, referenceDetail: "" });
  };

  const handleChittyChange = (selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      chitties: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      console.log(formData,"datassssssssssss");
      toast.success("Details added successfully!");
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
        referenceDetail: "",
        chitties: [],
      });
      setErrors({});
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
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="state"
                >
                  State<sup className="text-red-500">*</sup>
                </label>
                <select
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.state ? "border-red-500" : ""
                  }`}
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State*</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
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
                  className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                    errors.district ? "border-red-500" : ""
                  }`}
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                >
                  <option value="">Select District*</option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-5">
  <div>
    <label className="block text-gray-700 font-bold mb-2" htmlFor="pin">
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
    {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
  </div>

  <div>
    <label className="block text-gray-700 font-bold mb-2" htmlFor="reference">
      Reference<sup className="text-red-500">*</sup>
    </label>
    <select
      className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
        errors.reference ? "border-red-500" : ""
      }`}
      name="reference"
      value={formData.reference}
      onChange={handleReferenceChange}
    >
      <option value="">Select Reference*</option>
      <option value="agent">Agent</option>
      <option value="staff">Staff</option>
      <option value="socialmedia">Social Media</option>
      <option value="direct">Direct</option>
    </select>
    {errors.reference && (
      <p className="text-red-500 text-sm mt-1">{errors.reference}</p>
    )}
  </div>

  {/* Reference Detail Section */}
  <div>
    <label className="block text-gray-700 font-bold mb-2" htmlFor="referenceDetail">
      Reference Detail
    </label>
    {formData.reference ? (
      <select
        className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
          errors.referenceDetail ? "border-red-500" : "border-gray-300"
        }`}
        name="referenceDetail"
        value={formData.referenceDetail}
        onChange={(e) =>
          setFormData({
            ...formData,
            referenceDetail: e.target.value,
          })
        }
      >
        {formData.reference === "agent" && agentOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {formData.reference === "socialmedia" && socialMedia.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {formData.reference === "direct" && directOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {formData.reference === "staff" && staffOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        className={`w-full bg-gray-100 text-gray-900 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
          errors.referenceDetail ? "border-red-500" : "border-gray-300"
        }`}
        type="text"
        name="referenceDetail"
        placeholder="Select Reference"
        disabled
        value={formData.referenceDetail}
        onChange={(e) =>
          setFormData({
            ...formData,
            referenceDetail: e.target.value,
          })
        }
      />
    )}
    {errors.referenceDetail && (
      <p className="text-red-500 text-sm mt-1">{errors.referenceDetail}</p>
    )}
  </div>
</div>


            <div className="mt-5">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="chitties"
              >
                Select Chitty<sup className="text-red-500">*</sup>
              </label>
              <Select
                isMulti
                name="chitties"
                value={chittyOptions.filter((option) =>
                  formData.chitties.includes(option.value)
                )}
                onChange={handleChittyChange}
                options={chittyOptions}
                className={`${errors.chitties ? "border-red-500" : ""}`}
                placeholder="Select Chitty*"
              />
              {errors.chitties && (
                <p className="text-red-500 text-sm mt-1">{errors.chitties}</p>
              )}
            </div>

            <div className="col-span-2 w-full flex justify-center mt-5">
              <button
                type="submit"
                className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-[#7fb715] to-[#066769] text-gray-100 p-3 rounded-lg w-full max-w-xs focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
            <ToastContainer position="top-center"/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
