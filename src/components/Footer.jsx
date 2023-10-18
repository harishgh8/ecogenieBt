import React from "react";
import {
  FaFacebookSquare,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaTwitterSquare,
} from "react-icons/fa";
import logo_bw from "../assets/logo_bw.png";
import startupIndia from "../assets/Startup_India.png";
import startupKarnataka from "../assets/Startup_Karnataka.png";
import { PRODUCTS } from "../data/productsData";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className=" mx-auto py-10 grid lg:grid-cols-3 gap-8 text-gray-300 bg-teal-900  px-10">
        <div className="flex flex-col justify-center">
          <Link to="/">
            <img className="h-8 sm:h-14 ml-0 " src={logo_bw} alt="/" />
          </Link>
          <p className="py-4">
            Empowering a Greener Future with Cutting-Edge Biotechnology
            Products.
          </p>
          <div className="flex gap-5 md:w-[75%] my-6">
            <a
              href="https://www.facebook.com/profile.php?id=100091364877101"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookSquare size={30} />
            </a>
            <FaInstagram size={30} />
            <FaYoutube size={30} />
            <a
              href="https://www.linkedin.com/in/ecogenie-biotech-939058276/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={30} />
            </a>

            <FaTwitterSquare size={30} />
          </div>
          <p className="py-4">Recognized as a startup by:</p>
          <div className="flex gap-3 md:w-[75%] ">
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
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-5 sm:gap-20 mt-6">
          <div>
            <Link to="/AllProductsPage">
              <h6 className="font-medium text-gray-400  underline decoration-orange-400">
                Categories
              </h6>
            </Link>
            <ul>
              {PRODUCTS.map((category, index) => (
                <li className="py-2 text-sm" key={index}>
                  {category.title}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400  underline decoration-orange-400">
              Products
            </h6>
            <ul>
              <li className="py-2 text-sm">Technology</li>
              <li className="py-2 text-sm">Marketing</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400  underline decoration-orange-400">
              Support
            </h6>
            <ul>
              <li className="py-2 text-sm">Pricing</li>
              <li className="py-2 text-sm">Documentation</li>
              <li className="py-2 text-sm">Guides</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400  underline decoration-orange-400">
              Company
            </h6>
            <ul>
              <li className="py-2 text-sm">About</li>
              <li className="py-2 text-sm">Blog</li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400  underline decoration-orange-400">
              Legal
            </h6>
            <ul>
              <li className="py-2 text-sm">Licence</li>
              <li className="py-2 text-sm">Policy</li>
              <li className="py-2 text-sm">Terms</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-teal-800 text-neutral-200 text-xs flex justify-center h-10">
        © All rights reserved by ecoGenei biotech, Bengaluru{" "}
      </div>
    </>
  );
};

export default Footer;
