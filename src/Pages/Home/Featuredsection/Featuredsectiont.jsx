import React from "react";
import { FaHandHoldingHeart, FaSyringe, FaUsers } from "react-icons/fa";

const initiatives = [
  {
    icon: <FaHandHoldingHeart size={30} className="text-red-600" />,
    title: "Lifesaving Donations",
    description:
      "We organize blood drives that have consistently helped thousands survive emergency situations.",
  },
  {
    icon: <FaSyringe size={30} className="text-red-600" />,
    title: "Safe & Easy Process",
    description:
      "Our donation procedure is simple, hygienic, and donor-friendly ensuring everyone’s comfort.",
  },
  {
    icon: <FaUsers size={30} className="text-red-600" />,
    title: "Community Engagement",
    description:
      "Engaging volunteers and communities to promote awareness and regular blood donation habits.",
  },
];

const FeaturedSection = () => {
  return (
    <section className="flex flex-col md:flex-row max-w-6xl mx-auto my-16 px-6">
      {/* Left Side Content */}
      <div className="md:w-1/2 flex flex-col justify-center pr-10">
        <h2 className="text-4xl font-extrabold text-red-600 mb-6 animate-slideInLeft">
           Why Donate Blood with Us?
        </h2>
        <p className="text-gray-700 mb-8 max-w-xl leading-relaxed animate-slideInLeft delay-150">
          Join a network committed to saving lives through regular, safe, and community-supported blood donations.
          Your contribution can make the difference between life and death.
        </p>

        <ul className="space-y-6">
          {initiatives.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 animate-slideInLeft delay-[300ms]"
            >
              <div className="flex-shrink-0 bg-red-100 rounded-full p-3 shadow-md">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <a
          href="/get-involved"
          className="mt-10 inline-block bg-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-700 transition transform hover:scale-105"
        >
          Become a Donor
        </a>
      </div>

      {/* Right Side Image */}
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center animate-fadeInRight">
        {/* Replace the below div with an <img> or SVG illustration */}
        <div className="w-full max-w-md h-72 bg-red-100 rounded-xl shadow-lg flex items-center justify-center text-red-400 text-9xl select-none">
          ❤️
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
