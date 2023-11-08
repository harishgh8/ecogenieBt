import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import logo_02 from "../assets/logo_bw.png";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const sidebarRef = useRef();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setNav(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute z-50 flex justify-between items-center h-30 mx-auto px-4  text-white   top-0 left-0 right-0 sm:px-10 sm:my-6">
      <div className="sm:flex gap-3 md:w-[50%]  items-center">
        <Link to="/">
          <div className="m-5">
            <img className=" h-8 sm:h-14 mx-auto" src={logo_02} alt="/" />
          </div>
        </Link>
      </div>

      <ul className="hidden md:flex">
        <Link to="/AllProductsPage">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 font-bold text-neutral-200  "
          >
            PRODUCTS
          </motion.button>
        </Link>
        <Link to="/Solutions">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 font-bold text-neutral-200"
          >
            OUR TECHNOLOGY
          </motion.button>
        </Link>
        <Link to="/Blog">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 font-bold  text-neutral-200"
          >
            BLOG
          </motion.button>
        </Link>

        <Link to="/Contact">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 font-bold  text-neutral-200"
          >
            CONTACT
          </motion.button>
        </Link>
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        ref={sidebarRef}
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900  bg-teal-600 sm:hidden ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-2xl sm:text-3xl font-bold text-[#00df9a] m-4">
          <Link to="/" onClick={handleNav}>
            <div>
              <img className="h-8 sm:h-14 mx-auto " src={logo_02} alt="/" />
            </div>
          </Link>
        </h1>
        <Link to="/AllProductsPage">
          <li className="p-4 text-[#00df9a] " onClick={handleNav}>
            PRODUCTS
          </li>
        </Link>

        <Link to="/Solutions">
          <li className="p-4 text-[#00df9a]" onClick={handleNav}>
            OUR TECHNOLOGY
          </li>
        </Link>
        <Link to="/Blog">
          <li className="p-4 text-[#00df9a]" onClick={handleNav}>
            BLOG
          </li>
        </Link>

        <Link to="/Contact">
          <li className="p-4 text-[#00df9a]" onClick={handleNav}>
            CONTACT
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
