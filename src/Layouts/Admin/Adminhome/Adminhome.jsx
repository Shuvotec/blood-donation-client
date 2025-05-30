import React, { useContext } from 'react';
import { BiDonateBlood } from "react-icons/bi";
import { FaUsers, FaHeartbeat, FaCalendarCheck, FaPenNib } from 'react-icons/fa';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaClipboardList } from 'react-icons/fa';

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Adminhome = () => {
  const { user } = useContext(AuthContext);

  const { data = [], error, isLoading } = useQuery({
    queryKey: ['createdonation'],
    queryFn: () =>
      fetch('http://localhost:5000/createdonation').then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      }),
  });

  const aCount = data.filter(user => user?.bloodGroup === 'A+').length;
  const bCount = data.filter(user => user?.bloodGroup === 'B+').length;
  const abPlusCount = data.filter(user => user?.bloodGroup === 'AB+').length;
  const aMinus = data.filter(user => user?.bloodGroup === 'A-').length;
  const bMinus = data.filter(user => user?.bloodGroup === 'B-').length;
  const abMinus = data.filter(user => user?.bloodGroup === 'AB-').length;
  const oPlus = data.filter(user => user?.bloodGroup === 'O+').length;
  const oMinus = data.filter(user => user?.bloodGroup === 'O-').length;

  return (
    <div className="min-h-screen shadow-md p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Donors</h3>
            <div className="opacity-80"><FaUsers size={30} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/90">Active</p>
              <p className="text-xl font-semibold">{data.length}</p>
            </div>
            <div>
              <p className="text-sm text-white/90">Inactive</p>
              <p className="text-xl font-semibold">567</p> 
            </div>
            <div>
              <p className="text-sm text-white/90">New</p>
              <p className="text-xl font-semibold">89</p> 
            </div>
            <div>
              <p className="text-sm text-white/90">Banned</p>
              <p className="text-xl font-semibold">12</p> 
            </div>
          </div>
          <div className='flex justify-between'>
            <Link
              to="/dashboard/userall"
              className="inline-flex items-center mt-20 gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
              title="Go to All Users"
            >
              <FaUsers size={20} />
              <span>All Users</span>
            </Link>

            <Link
              to="/dashboard/content-management"
              className="inline-flex items-center mt-20 gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
              title="Create Blog"
            >
              <FaPenNib size={30} />
              <span className="hidden sm:inline text">Create Blog</span>
            </Link>

            <Link
              to="/dashboard/all-blood-donation-request"
              className="inline-flex items-center mt-20 gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
              title="Donation Requests"
            >
                    <FaClipboardList size={20} />

              <span>Donation Requests</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Blood Group Distribution</h3>
            <div className="opacity-80"><BiDonateBlood size={40} color="crimson" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-white/90">A+</p><p className="text-xl font-semibold">{aCount} bags</p></div>
            <div><p className="text-sm text-white/90">B+</p><p className="text-xl font-semibold">{bCount} bags</p></div>
            <div><p className="text-sm text-white/90">AB+</p><p className="text-xl font-semibold">{abPlusCount} bags</p></div>
            <div><p className="text-sm text-white/90">A-</p><p className="text-xl font-semibold">{aMinus} bags</p></div>
            <div><p className="text-sm text-white/90">B-</p><p className="text-xl font-semibold">{bMinus} bags</p></div>
            <div><p className="text-sm text-white/90">AB-</p><p className="text-xl font-semibold">{abMinus} bags</p></div>
            <div><p className="text-sm text-white/90">O+</p><p className="text-xl font-semibold">{oPlus} bags</p></div>
            <div><p className="text-sm text-white/90">O-</p><p className="text-xl font-semibold">{oMinus} bags</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Donation Growth</h3>
            <div className="opacity-80"><FaHeartbeat size={30} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-white/90">This Month</p><p className="text-xl font-semibold">8.7%</p></div>
            <div><p className="text-sm text-white/90">Last Month</p><p className="text-xl font-semibold">7.2%</p></div>
            <div><p className="text-sm text-white/90">This Quarter</p><p className="text-xl font-semibold">25%</p></div>
            <div><p className="text-sm text-white/90">Last Quarter</p><p className="text-xl font-semibold">22%</p></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Appointments</h3>
            <div className="opacity-80"><FaCalendarCheck size={30} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-white/90">Completed</p><p className="text-xl font-semibold">45</p></div>
            <div><p className="text-sm text-white/90">Pending</p><p className="text-xl font-semibold">12</p></div>
            <div><p className="text-sm text-white/90">No Shows</p><p className="text-xl font-semibold">3</p></div>
            <div><p className="text-sm text-white/90">Total Bookings</p><p className="text-xl font-semibold">60</p></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Adminhome;
