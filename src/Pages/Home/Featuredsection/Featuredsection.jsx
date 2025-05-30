import React from 'react';
import { FaTint, FaHandsHelping, FaHeartbeat } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Emergency Response",
    icon: <FaTint size={28} className="text-white" />,
    description: "Swift blood drives during critical needs, collecting hundreds of units within hours.",
    bg: "bg-red-500"
  },
  {
    title: "Community Outreach",
    icon: <FaHandsHelping size={28} className="text-white" />,
    description: "Partnering with local groups and hospitals to ensure blood availability in rural areas.",
    bg: "bg-rose-500"
  },
  {
    title: "Youth Initiatives",
    icon: <FaHeartbeat size={28} className="text-white" />,
    description: "University-led drives creating awareness and building a strong network of student donors.",
    bg: "bg-pink-500"
  },
];

const Featuredsection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-12">
          Featured Impact
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 border-t-4 border-transparent hover:border-red-400"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bg} mb-4 transition-transform duration-300 group-hover:rotate-12`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/register"
            className="inline-block bg-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Join the Mission
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featuredsection;
