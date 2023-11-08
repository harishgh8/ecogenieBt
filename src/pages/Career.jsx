import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import ScrollToTopButton from "../components/ScrollToTopButton";

const JobListing = ({ title, location }) => (
  <div className=" p-4 my-4 shadow-md rounded-lg bg-teal-600">
    <h2 className="font-semibold">{title}</h2>
    <p className="text-gray-600">{location}</p>
    {/* <button className="bg-blue-500 text-white font-semibold p-2 mt-4 rounded-full">
      Apply Now
    </button> */}
  </div>
);

const Career = () => {
  const form = useRef();
  const [messageSent, setMessageSent] = useState(false);
  const [lastFormData, setLastFormData] = useState({});

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = {
      user_name: form.current.user_name.value,
      user_phoneNumber: form.current.user_phoneNumber.value,
      user_email: form.current.user_email.value,
      message: form.current.message.value,
    };

    if (JSON.stringify(formData) === JSON.stringify(lastFormData)) {
      alert("Message has already been sent");
      return;
    }

    emailjs
      .sendForm(
        "service_x0p9nic",
        "template_ljbive4",
        form.current,
        "ZCbeEpQyku_3xUQEj"
      )
      .then(
        (result) => {
          console.log(result.text);
          setMessageSent(true);
          setTimeout(() => {
            setMessageSent(false);
          }, 2000);
          setLastFormData(formData);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="bg-teal-800 text-white pt-10 h-screen">
      <div className="max-w-6xl mx-auto pt-20 ">
        <div className="bg-teal-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mt-4">Current Job Openings</h2>
          {/* <JobListing title="Frontend Developer" location="New York, NY" />
          <JobListing title="Backend Developer" location="San Francisco, CA" /> */}
          <JobListing title="Thank you for your interest in our company! While we don't have any current job openings, we'd be delighted to keep your resume on file for future opportunities. Your enthusiasm is greatly appreciated. Thank you!" />

          <div className="w-full md:w-1/2 pb-20 sm:pb-0 ">
            <form ref={form} onSubmit={sendEmail} className="space-y-4 ">
              <div className="sm:w-[600px]">
                <input
                  required
                  name="user_name"
                  className="p-3 flex w-full rounded-md text-black"
                  type="text"
                  placeholder="Enter your Name"
                />
              </div>
              <div className="sm:w-[600px]">
                <input
                  required
                  name="user_phoneNumber"
                  className="p-3 flex w-full rounded-md text-black"
                  type="number"
                  placeholder="Phone Number"
                />
              </div>
              <div className="sm:w-[600px]">
                <input
                  name="user_email"
                  className="p-3 flex w-full rounded-md text-black"
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className="sm:w-[600px]">
                <textarea
                  required
                  className="w-full border p-2 rounded-md text-black"
                  rows="6"
                  placeholder="Paste your Resume here / Send us a message"
                  name="message"
                ></textarea>
              </div>
              <div className="flex justify-center sm:justify-start ">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  onHoverStart={(e) => {}}
                  onHoverEnd={(e) => {}}
                  whileTap={{ scale: 0.9 }}
                  className={`bg-[#00df9a] text-black py-2 px-4 rounded-md font-medium ${
                    messageSent ? "animate-pulse" : ""
                  }`}
                  type="submit"
                  value="Send"
                  disabled={messageSent}
                >
                  {messageSent ? "Message Sent" : "Send"}
                </motion.button>
              </div>
            </form>
            {messageSent && (
              <div>
                <div className="bg-green-500 text-white font-bold rounded-md px-4 py-4">
                  Thank you, message sent
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Career;
