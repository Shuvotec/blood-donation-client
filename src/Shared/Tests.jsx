import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUserAlt, FaChartLine, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logged out");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-64 bg-white shadow-lg p-5`}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 md:hidden"
          >
            <FaSignOutAlt />
          </button>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/dashboard/home"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <FaHome />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <FaUserAlt />
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/stats"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
              >
                <FaChartLine />
                Stats
              </NavLink>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 bg-red-600 text-white rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Welcome, User!</h1>
            <p className="text-gray-600">Your dashboard overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Total Sales</h3>
            <p className="text-2xl text-gray-900">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">New Users</h3>
            <p className="text-2xl text-gray-900">150</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Revenue</h3>
            <p className="text-2xl text-gray-900">$8,765</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
