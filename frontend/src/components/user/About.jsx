import React from "react";
import Navbar from "../Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="sm:flex items-center max-w-screen-xl">
        <div className="sm:w-1/2 p-10">
          <div className="image object-center text-center">
            <img src="https://i.imgur.com/WbQnbas.png" alt="About Us" />
          </div>
        </div>
        <div className="sm:w-1/2 p-5">
          <div className="text">
            
            <h2 className="my-4 text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7fb715] via-blue-900 to-[#066769]">
              KSFE <span className="text-indigo-600">at a Glance</span>
            </h2>
            <p className="text-gray-700">
              The Kerala State Financial Enterprises Limited, popularly known as
              KSFE, Is a Miscellaneous Non-Banking Company, Is fully owned by
              the Government of Kerala. Is one of the most profit-making public
              sector undertakings of the State. Formed by the Government of
              Kerala with the objective of providing an alternative to the
              public from the private chit promoters in order to bring in social
              control over the chit fund business, so as to save the public from
              the clutches of unscrupulous fly-by-night chit fund operators. Has
              been registering impressive profits every year, without fail since
              its inception.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
