import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/services';
import logo from '../../assets/ksfe-logo.svg';
import { toast, ToastContainer } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentToastId, setCurrentToastId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user_accesstoken')) {
      navigate('/enquiry');
    }
  }, [navigate]);

  const validate = () => {
    let formErrors = {};
    if (!username.trim()) formErrors.username = '*Username is required';
    if (!password.trim()) formErrors.password = '*Password is required';
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

      userLogin(loginData)
        .then((data) => {
          if (currentToastId) {
            toast.dismiss(currentToastId);
          }

          if (data?.user_accestoken) {
            localStorage.setItem('user_accesstoken', data.user_accestoken);
            localStorage.setItem('userType', data.user_type);
            navigate('/enquiry');
          } else {
            const toastId = toast.error(data?.message || 'An unexpected error occurred.', { toastId: 156 });
            setCurrentToastId(toastId);
          }
        })
        .catch((err) => {
          if (currentToastId) {
            toast.dismiss(currentToastId);
          }
          const toastId = toast.error(err?.response?.data?.message || 'Error logging in. Please try again.', { toastId: 157 });
          setCurrentToastId(toastId);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }, [isSubmitting, username, password, navigate, currentToastId]);

  return (
    <div>
      <section className="bg-white">
        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
          <img className="w-40 h-20 mr-2" src={logo} alt="logo" />
          <div className="w-full bg-neutral-200 rounded-2xl shadow-md md:mt-1 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-4xl font-bold text-center leading-tight tracking-tight text-bluedark md:text-3xl">
                Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-blue-600">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`bg-white border ${errors.username ? 'border-red-500' : 'border-blue-600'} text-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                    placeholder="Username"
                    required
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-3 text-sm font-medium text-blue-600">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`bg-white border ${errors.password ? 'border-red-500' : 'border-blue-600'} text-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                    placeholder="••••••••"
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-[#043369] hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
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

export default Login;
