  import React, { useState } from "react";
  import Select from 'react-select';
  import logo from '../../assets/ksfe-logo.svg';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

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
      chitties: []
    });

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const chittyOptions = [
      { value: "KGC-S1", label: "KSFE Galaxy Chit Series-1 (KGC-S1) (From April 2024 to June 2024)" },
      { value: "KGC-S2", label: "KSFE Galaxy Chit Series-2 (KGC-S2) (From July 2024 to October 2024)" },
      { value: "KGC-S3", label: "KSFE Galaxy Chit Series-3 (KGC-S3) (From November 2024 to February 2025)" }
    ];

    const staffOptions = [
      { value: "", label: "Select Staff" },
      { value: "John", label: "John Doe" },
      { value: "James", label: "James Frence" },
      { value: "Alice", label: "Alice George" }
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
      if (formData.reference === 'agent' && !formData.referenceDetail) formErrors.referenceDetail = "*Agent name is required";
      if (formData.reference === 'staff' && !formData.referenceDetail) formErrors.referenceDetail = "*Staff selection is required";
      if (formData.chitties.length === 0) formErrors.chitties = "*At least one chitty must be selected";
      return formErrors;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleReferenceChange = (e) => {
      const { value } = e.target;
      setFormData({ ...formData, reference: value, referenceDetail: '' });
    };

    const handleChittyChange = (selectedOptions) => {
      setFormData(prevState => ({
        ...prevState,
        chitties: selectedOptions ? selectedOptions.map(option => option.value) : []
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length === 0) {
        toast.success("Details added successfully!");
        setIsSubmitted(true);
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
          chitties: []
        });
        setErrors({});
      } else {
        setErrors(formErrors);
      }
    };

    return (
      <div className="flex justify-center items-start min-h-screen bg-white pt-4">
        <div className="container mx-auto px-4 lg:px-20">
          <div className="flex justify-center mb-2">
            <img className="w-32 h-32" src={logo} alt="KSFE Logo" />
          </div>
          <div className="w-full p-4 md:px-8 lg:pl-16 lg:pr-32 mx-auto rounded-2xl shadow-lg">
            <div className="flex justify-center mb-2 ml-10">
              <h1 className="font-bold uppercase text-4xl">
                User Details
              </h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  {errors.name && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.name}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.mobile ? 'border-red-500' : ''}`}
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                  />
                  {errors.mobile && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.mobile}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.address ? 'border-red-500' : ''}`}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                  {errors.address && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.address}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  {errors.email && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.email}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.district ? 'border-red-500' : ''}`}
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="District"
                  />
                  {errors.district && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.district}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.state ? 'border-red-500' : ''}`}
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                  {errors.state && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.state}</p>}
                </div>

                <div className="relative">
                  <input
                    className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.pin ? 'border-red-500' : ''}`}
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="PIN"
                  />
                  {errors.pin && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.pin}</p>}
                </div>

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
                  {errors.reference && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.reference}</p>}
                </div>

                {formData.reference && (
                  <div className="relative">
                    {formData.reference === 'staff' && (
                      <select
                        className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
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
                        className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        type="text"
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                        placeholder="Agent Name*"
                      />
                    )}
                    {formData.reference === 'socialmedia' && (
                      <select
                        className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
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
                        className={`w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${errors.referenceDetail ? 'border-red-500' : ''}`}
                        name="referenceDetail"
                        value={formData.referenceDetail}
                        onChange={handleChange}
                      >
                        <option value="">Select Option</option>
                        <option value="visit">Visit</option>
                        <option value="call">Call</option>
                      </select>
                    )}
                    {errors.referenceDetail && <p className="absolute text-red-500 text-s mt-1 ml-2">{errors.referenceDetail}</p>}
                  </div>
                )}
              </div>

              <div className="my-5">
                <h3 className="font-bold">Select Chitties:</h3>
                <Select
                  isMulti
                  name="chitties"
                  options={chittyOptions}
                  className="basic-single mt-2"
                  classNamePrefix="select"
                  onChange={handleChittyChange}
                  value={chittyOptions.filter(option => formData.chitties.includes(option.value))}
                />
                {errors.chitties && <p className="text-red-500 text-s mt-1 ml-2">{errors.chitties}</p>}
              </div>

              <div className="my-5 w-full flex justify-center">
                <button
                  type="submit"
                  className="uppercase text-sm font-bold tracking-wide bg-gradient-to-r from-[#7fb715] to-[#066769] text-gray-100 p-3 rounded-lg w-full max-w-xs
                    focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <ToastContainer  position="top-center"/>
      </div>
    );
  };

  export default Enquiry;
