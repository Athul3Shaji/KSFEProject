import React, { useState } from "react";
import logo from '../assets/ksfe-logo.svg';

const Enquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    email: '',
    district: '',
    state: '',
    pin: '',
    reference: '',
    referenceDetail: '',
    chitty: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Options for chitty and staff
  const chittyOptions = [
    { value: "", label: "Select Chitty" },
    { value: "KGC-S1", label: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)" },
    { value: "KGC-S2", label: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)" },
    { value: "KGC-S3", label: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)" }
  ];

  const staffOptions = [
    { value: "", label: "Select Staff" },
    { value: "staff1", label: "Staff 1" },
    { value: "staff2", label: "Staff 2" },
    { value: "staff3", label: "Staff 3" }
  ];

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "*Name is required";
    if (!formData.mobile) formErrors.mobile = "*Mobile is required";
    if (!formData.address) formErrors.address = "*Address is required";
    if (!formData.district) formErrors.district = "*District is required";
    if (!formData.state) formErrors.state = "*State is required";
    if (!formData.pin) formErrors.pin = "*PIN is required";
    // if (!formData.chitty) formErrors.chitty = "*Select your Chitty";
    if (!formData.reference) formErrors.reference = "*Reference is required";
    if (formData.reference === 'agent' && !formData.referenceDetail) formErrors.referenceDetail = "*Agent name is required";
    if (formData.reference === 'staff' && !formData.referenceDetail) formErrors.referenceDetail = "*Staff selection is required";
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReferenceChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, reference: value, referenceDetail: '' }); // Reset referenceDetail on reference change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        address: '',
        email: '',
        district: '',
        state: '',
        pin: '',
        reference: '',
        referenceDetail: '',
        chitty: ''
      });
      setErrors({});
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-white pt-8">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex justify-center mb-6">
          <img className="w-32 h-32" src={logo} alt="KSFE Logo" />
        </div>
        <div className="w-full p-4 md:px-8 lg:pl-16 lg:pr-32 mx-auto rounded-2xl shadow-2xl">
          <div className="flex justify-center mb-6">
            <h1 className="font-bold uppercase text-5xl">
              User Details
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
              {/* Name */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                {errors.name && <p className="absolute text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Mobile */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.mobile ? 'border-red-500' : ''}`}
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile"
                />
                {errors.mobile && <p className="absolute text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {/* Address */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
                {errors.address && <p className="absolute text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {errors.email && <p className="absolute text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* District */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.district ? 'border-red-500' : ''}`}
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="District"
                />
                {errors.district && <p className="absolute text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              {/* State */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.state ? 'border-red-500' : ''}`}
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
                {errors.state && <p className="absolute text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              {/* PIN */}
              <div className="relative">
                <input
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.pin ? 'border-red-500' : ''}`}
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="PIN"
                />
                {errors.pin && <p className="absolute text-red-500 text-xs mt-1">{errors.pin}</p>}
              </div>

              {/* Reference */}
              <div className="relative">
                <select
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.reference ? 'border-red-500' : ''}`}
                  name="reference"
                  value={formData.reference}
                  onChange={handleReferenceChange}
                >
                  <option value="">Select Reference</option>
                  <option value="staff">Staff</option>
                  <option value="agent">Agent</option>
                  <option value="socialmedia">Social Media</option>
                  <option value="direct">Direct</option>
                </select>
                {errors.reference && <p className="absolute text-red-500 text-xs mt-1">{errors.reference}</p>}
                {/* Reference detail field */}
                {formData.reference && (
                  <div className="absolute top-full left-0 mt-1.4rem w-full">
                    {formData.reference === 'staff' && (
                      <select
                        className={`w-full bg-gray-100 text-gray-900 mt-7 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                      >
                        {staffOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    )}
                    {formData.reference === 'agent' && (
                      <input
                        className={`w-full bg-gray-100 text-gray-900 mt-7 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        type="text"
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                        placeholder="Agent Name*"
                      />
                    )}
                    {formData.reference === 'socialmedia' && (
                      <select
                        className={`w-full bg-gray-100 text-gray-900 mt-7 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                      >
                        <option value="">Select Platform</option>
                        <option value="FB">Facebook</option>
                        <option value="Whatsapp">WhatsApp</option>
                        <option value="Instagram">Instagram</option>
                      </select>
                    )}
                    {formData.reference === 'direct' && (
                      <select
                        className={`w-full bg-gray-100 text-gray-900 mt-7 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                      >
                        <option value="">Select Option</option>
                        <option value="visit">Visit</option>
                        <option value="call">Call</option>
                      </select>
                    )}
                    {errors.referenceDetail && <p className="text-red-500 text-xs mt-1">{errors.referenceDetail}</p>}
                  </div>
                )}
              </div>

              {/* Chitty */}
              <div className="relative">
                <select
                  className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.chitty ? 'border-red-500' : ''}`}
                  name="chitty"
                  value={formData.chitty}
                  onChange={handleChange}
                >
                  {chittyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.chitty && <p className="absolute text-red-500 text-xs mt-1">{errors.chitty}</p>}
              </div>
            </div>

            <div className="my-5 w-full flex justify-center">
              <button
                type="submit"
                className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full max-w-xs 
                  focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {isSubmitted && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-black">Details added successfully!</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full 
                focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
