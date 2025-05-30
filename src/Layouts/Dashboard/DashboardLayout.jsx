import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { IoAddCircleSharp } from "react-icons/io5";
import { FaHome, FaUserEdit, FaArrowLeft, FaBars } from 'react-icons/fa';
import { GrUserAdmin } from "react-icons/gr";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const email = user?.email;

  const { data: userInfo, isLoading, error } = useQuery({
    queryKey: ['user', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userall/${email}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-[#732255]">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-[#732255]">
        Failed to load user information.
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/dashboard/profile/${email}`);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-white">
      <button
        className="md:hidden p-4 text-white bg-[#732255] flex items-center gap-2"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle Sidebar"
        aria-expanded={sidebarOpen}
      >
        <FaBars />
        Menu
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <motion.nav
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#732255] p-4 z-50 overflow-y-auto md:block ${sidebarOpen ? 'block' : 'hidden'}`}
        initial={{ x: -200 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -200 }}
        transition={{ type: 'spring', stiffness: 80 }}
        role="navigation"
        aria-label="Sidebar Navigation"
      >
        <ul className="menu text-center space-y-4">
          <li>
            <NavLink
              className="text-lg flex items-center gap-2"
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHome /> Home
            </NavLink>
          </li>

          {userInfo?.role === 'admin' && (
            <li>
              <NavLink
                className="text-lg flex items-center gap-2"
                to="/dashboard/admin/home"
                onClick={() => setSidebarOpen(false)}
              >
                <GrUserAdmin /> Admin Home
              </NavLink>
            </li>
          )}

          {userInfo?.role === 'volunteer' && (
            <li>
              <NavLink
                className="text-lg flex items-center gap-2"
                to="/dashboard/volunteer"
                onClick={() => setSidebarOpen(false)}
              >
                <GrUserAdmin /> Volunteer Home
              </NavLink>
            </li>
          )}

          <li>
            <button
              onClick={handleEdit}
              className="text-lg flex items-center gap-2"
            >
              <FaUserEdit /> Edit Profile
            </button>
          </li>

          <li>
            <NavLink
              className="text-lg flex items-center gap-2"
              to="/dashboard/create-donation-request"
              onClick={() => setSidebarOpen(false)}
            >
              <IoAddCircleSharp /> Create Donation
            </NavLink>
          </li>

          <li>
            <NavLink
              className="text-lg flex items-center gap-2"
              to="/"
              onClick={() => setSidebarOpen(false)}
            >
              <FaArrowLeft /> Back To Home
            </NavLink>
          </li>
        </ul>
      </motion.nav>

      <motion.main
        className="flex-1 bg-[#ad3457] p-6 mt-4 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h3 className="text-3xl font-bold text-center">
            Welcome, {user?.displayName || 'User'}!
          </h3>
        </motion.div>

        <div className="mt-10">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
