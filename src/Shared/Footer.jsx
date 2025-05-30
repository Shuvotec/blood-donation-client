import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaHandsHelping,
  FaTint,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaHome,
  FaSearch,
  FaClipboardList,
  FaBlog,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaPlusCircle,
  FaEdit,
  FaListAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const footerAnimation = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const Footer = () => {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerAnimation}
      className="bg-red-700 text-white select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 p-8">
       
        <div>
          <div className="flex items-center gap-4 mb-4">
            <FaHeartbeat className="text-red-300 text-6xl" />
            <h1 className="text-3xl font-extrabold tracking-wide">Blood Donation</h1>
          </div>
          <p className="text-red-200 leading-relaxed max-w-sm">
            Connecting donors and recipients to save lives. Join us and become a hero today.
          </p>

          <div className="flex items-center gap-3 mt-6 text-red-300 text-3xl">
            <FaHandsHelping title="Help & Support" />
            <FaTint title="Blood Drop" />
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-6">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { to: "/", label: "Home", icon: <FaHome className="inline mr-2" /> },
              { to: "/allsearch/donar", label: "Search Donors", icon: <FaSearch className="inline mr-2" /> },
              { to: "/donationreq/all", label: "Donation Requests", icon: <FaClipboardList className="inline mr-2" /> },
              { to: "/blog", label: "Blogs", icon: <FaBlog className="inline mr-2" /> },
              { to: "/login", label: "Login", icon: <FaSignInAlt className="inline mr-2" /> },
              { to: "/register", label: "Register", icon: <FaUserPlus className="inline mr-2" /> },
            ].map(({ to, label, icon }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="hover:text-red-300 transition duration-300 font-medium flex items-center"
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-6">Dashboard</h3>
          <ul className="space-y-3">
            {[
              { to: "/dashboard", label: "Donor Dashboard", icon: <FaTachometerAlt className="inline mr-2" /> },
              { to: "/dashboard/create-donation-request", label: "Create Donation Request", icon: <FaPlusCircle className="inline mr-2" /> },
              { to: "/dashboard/my-donation-requests", label: "My Donation Requests", icon: <FaListAlt className="inline mr-2" /> },
              { to: "/dashboard/profile/:email", label: "Edit Profile", icon: <FaEdit className="inline mr-2" /> },
              { to: "/dashboard/my-donationsall", label: "All Donations", icon: <FaClipboardList className="inline mr-2" /> },
            ].map(({ to, label, icon }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="hover:text-red-300 transition duration-300 font-medium flex items-center"
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-6">Contact Us</h3>
          <ul className="space-y-6 text-red-200 text-sm">
            <li className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-red-300 text-2xl" />
              <span>Mothbaria, Blood City, Barishal, Bangladesh</span>
            </li>
            <li className="flex items-center gap-4">
              <FaPhoneAlt className="text-red-300 text-2xl" />
              <span>01712610216</span>
            </li>
            <li className="flex items-center gap-4">
              <FaEnvelope className="text-red-300 text-2xl" />
              <span>shuvotec10@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-6">Follow Us</h3>
          <div className="flex gap-6 text-red-300 text-3xl">
            <a
              href="https://web.facebook.com/shuvo.howlader.941733"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-red-100"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-red-100"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-red-100"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pb-2 border-t border-red-600 pt-6 text-center text-sm text-red-300">
        &copy; {new Date().getFullYear()} Blood Donation. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
