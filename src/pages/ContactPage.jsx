import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

const ContactPage = () => {
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
    <>
      <div className="bg-teal-800 text-white pt-10">
        <div className="mx-auto text-center flex flex-col md:flex-row  align-center p-4 md:p-10">
          <div className="max-w-[600px] md:w-full flex flex-col justify-center pb-10 pt-10 sm:pb-0">
            <p className="text-[#00df9a] font-bold p-2 sm:text-left text-3xl flex justify-center sm:justify-start">
              Contact Details
            </p>
            <div className="flex flex-col">
              <div className="flex justify-center sm:justify-start sm:py-3">
                <div className="flex flex-col">
                  <p className="text-white font-bold px-2 sm:text-left text-1xl underline decoration-orange-400">
                    Registered offices
                  </p>
                  <h4 className="sm:text-left p-2">
                    {" "}
                    No. 3, Manjunatha complex,
                    <br /> 1st floor, SSA Road, <br /> 4th Main Road, Hebbal,
                    <br /> Bengaluru - 560024
                    <br /> Karnataka, India
                  </h4>
                </div>
              </div>
              <div className="flex justify-center sm:justify-start sm:py-3">
                <div className="flex flex-col">
                  <p className="text-white font-bold px-2 sm:text-left text-1xl underline decoration-orange-400">
                    Mail us
                  </p>
                  <h4 className="sm:text-left p-2">
                    {" "}
                    info@ecogeniebiotech.com
                  </h4>
                </div>
              </div>
              <div className="flex justify-center sm:justify-start sm:py-3">
                <div className="flex flex-col">
                  <p className="text-white font-bold px-2 sm:text-left text-1xl underline decoration-orange-400">
                    Call us
                  </p>
                  <h4 className="sm:text-left p-2"> +917676733634</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[600px] md:w-full flex flex-col justify-top p-4 sm:p-20">
            <h1 className="text-3xl font-bold mb-4 sm:text-left text-[#00df9a]">
              ENQUIRY FORM
            </h1>

            <form ref={form} onSubmit={sendEmail} className="space-y-4">
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
                  placeholder="Enter Email"
                />
              </div>
              <div className="sm:w-[600px]">
                <textarea
                  required
                  className="w-full border p-2 rounded-md text-black"
                  rows="6"
                  placeholder="Send us a message"
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
                  {messageSent ? "Message Sent" : "Send Message"}
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
        <div>
          <iframe
            title="Office Location"
            width="100%"
            height="450"
            loading="lazy"
            allowFullScreen=""
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3886.977225620955!2d77.58948297507759!3d13.037121587284286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDAyJzEzLjYiTiA3N8KwMzUnMzEuNCJF!5e0!3m2!1sen!2sca!4v1694620389008!5m2!1sen!2sca"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
