import React from 'react'
import logo from '../assets/ksfe-logo.svg'

const Login = () => {
  return (
    <div>
      <section className="bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-blue-600">
            <img className="w-40 h-20 mr-2" src={logo} alt="logo"/>    
          </a>
          <div className="w-full bg-neutral-200 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-blue-600 md:text-2xl">
                Login
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-600">Username</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="bg-white border border-blue-600 text-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                    placeholder="name@company.com" 
                    required=""
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-3 text-sm font-medium text-blue-600">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••" 
                    className="bg-white border border-blue-600 text-blue-600 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                    required=""
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full text-black bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
