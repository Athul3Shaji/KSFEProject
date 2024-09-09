import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/services";
import logo from "../../assets/ksfe-logo.svg";
import { toast, ToastContainer } from "react-toastify";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentToastId, setCurrentToastId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("userType")
    if (token&&user==="admin") {
      navigate("/adminhome");
    }
  }, [navigate]);

  const validate = () => {
    let formErrors = {};
    if (!username.trim()) formErrors.username = "*Username is required";
    if (!password.trim()) formErrors.password = "*Password is required";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
    } else {
      setErrors(formErrors);
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      const loginData = {
        username,
        userpassword: password,
      };

      adminLogin(loginData)
        .then((data) => {

          if (currentToastId) {
            toast.dismiss(currentToastId);
          }

          if (data?.admin_accestoken) {
            localStorage.setItem("accessToken", data.admin_accestoken);
            localStorage.setItem("userType", data.user_type);
            localStorage.setItem("refreshToken", data.refreshToken);
            navigate("/adminhome");
          } else if (data?.errorCode === 768) {
            const toastId = toast.error("Incorrect password", { toastId: 70 });
            setCurrentToastId(toastId);
          } else if (data?.errorCode === 778) {
            const toastId = toast.error("Email not found", { toastId: 71 });
            setCurrentToastId(toastId);
          } else {
            const toastId = toast.error(data?.message || "An unexpected error occurred.", { toastId: 56 });
            setCurrentToastId(toastId);
          }
        })
        .catch((err) => {
          if (currentToastId) {
            toast.dismiss(currentToastId);
          }
          const toastId = toast.error(err?.response?.data?.message || 'Error logging in. Please try again.', { toastId: 7 });
          setCurrentToastId(toastId);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [isSubmitting, username, password, navigate, currentToastId]);

  return (
    <div>
      <section className="bg-white ">
        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
          <img className="w-40 h-20 mr-2" src={logo} alt="logo" />
          <div className="w-full bg-neutral-200 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-black md:text-2xl">
                Admin
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`bg-white border ${
                      errors.username ? "border-red-500" : "border-black"
                    } text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5`}
                    placeholder="Username"
                    required
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-3 text-sm font-medium text-black"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-white border ${
                      errors.password ? "border-red-500" : "border-black"
                    } text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5`}
                    placeholder="***********"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full text-white bg-[#043369] hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                    isSubmitting ? "cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AdminLogin;
