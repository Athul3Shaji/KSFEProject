import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/services';
import logo from '../../assets/ksfe-logo.svg';
import { toast } from 'react-toastify';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State to toggle mobile menu
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (localStorage.getItem("accessToken")) {
  //     navigate('/adminhome');
  //   } else {
  //     navigate('/admin');
  //   }
  // }, [navigate]);

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
      adminLogin({ username, password })
        .then((data) => {
          if (data?.errorCode === 768) {
            toast.error("Incorrect password", { toastId: 70 });
          } else if (data?.errorCode === 778) {
            toast.error("Email not found", { toastId: 71 });
          } else if (data?.accessToken) {
            localStorage.setItem("accessToken", data?.accessToken);
            localStorage.setItem("refreshToken", data?.refreshToken);
            navigate("/adminhome");
          } else {
            toast.error(data?.message, { toastId: 56 });
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message, { toastId: 7 });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [isSubmitting, username, password, navigate]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

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
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-black">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`bg-white border ${errors.username ? 'border-red-500' : 'border-black'} text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5`}
                    placeholder="Username"
                    required
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-3 text-sm font-medium text-black">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-white border ${errors.password ? 'border-red-500' : 'border-black'} text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5`}
                    placeholder="***********"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-[#043369] hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
