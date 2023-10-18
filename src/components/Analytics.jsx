import React from "react";
import { Link } from "react-router-dom";
import seedling from "../assets/seedling.png";
import { motion } from "framer-motion";
const Analytics = () => {
  return (
    <div className="w-full bg-neutral-200 py-5 px-4">
      <div className=" mx-auto grid md:grid-cols-2">
        <img className="w-[500px] mx-auto my-4" src={seedling} alt="/" />
        <div className="flex flex-col justify-center items-center md:items-start">
          <p className="text-[#00df9a] font-bold ">Save soil</p>
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Unleash the Power of Nature with Our Biofertilizer
          </h1>
          <p>
            Join the Movement towards a Sustainable Future with Our Innovative
            and Eco-Friendly Biofertilizer Solutions. Say Goodbye to Harmful
            Chemicals and Hello to Healthy, Abundant Crops.
          </p>
          <Link to="/Contact">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3"
            >
              CONTACT US
            </motion.button>
            {/* <button className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3">
              CONTACT US
            </button> */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
