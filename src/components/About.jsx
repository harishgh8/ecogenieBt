import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import startupIndia from "../assets/Startup_India.png";
import startupKarnataka from "../assets/Startup_Karnataka.png";
import logo_green from "../assets/logo_green.png";
const About = () => {
  return (
    <div className="w-full  py-5 px-4 bg-teal-900 ">
      <div className=" mx-auto  grid md:grid-cols-2 ">
        <div className="m-5 flex flex-col justify-center items-center bg-slate-100 rounded-lg">
          <Link to="/">
            <img className="h-14 sm:h-40 mx-auto " src={logo_green} alt="/" />
          </Link>
          <div className=" flex justify-center items-center pt-10">
            <img
              className="h-8 sm:h-14 ml-0 "
              src={startupIndia}
              alt="startupindia"
            ></img>
            <img
              className="h-8 sm:h-14 ml-0 "
              src={startupKarnataka}
              alt="startupKarnatak"
            ></img>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center md:items-start bg-teal-900">
          <h1 className="md:text-3xl sm:text-2xl text-1xl font-bold py-2 text-neutral-200">
            About Us
          </h1>
          <br />
          <p className="text-neutral-100  text-sm sm:text-lg">
            At ecoGenie we strive to create a better future for our planet by
            providing eco-friendly products that minimize harm to the
            environment. Our motto reflects our commitment to sustainability and
            the impact we hope to make: "Creating a Greener Future Together"
            This motto represents our belief that positive change requires
            collective action.
            <br />
            We recognize that sustainability is not just our responsibility, but
            the responsibility of every individual and organization. By working
            together, we can create a future where the planet thrives and future
            generations can enjoy its beauty. Our products are designed with
            this goal in mind. We use sustainable materials and manufacturing
            processes to reduce our carbon footprint and waste. We prioritize
            products that are reusable, recyclable, and compostable, so that
            they can be disposed of responsibly and have a second life.
          </p>
          <br />
          {/* <div className=" flex">
            <img
              className="h-8 sm:h-14 ml-0 "
              src={startupIndia}
              alt="startupindia"
            ></img>
            <img
              className="h-8 sm:h-14 ml-0 "
              src={startupKarnataka}
              alt="startupKarnatak"
            ></img>
          </div> */}
          <Link to="/Contact">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black text-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3"
            >
              KNOW MORE
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
