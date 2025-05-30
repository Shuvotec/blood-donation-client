import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaTint, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Donationreqall = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const { data: donations = [], isLoading, error } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/createdonation');
      if (!res.ok) throw new Error('Failed to fetch donations');
      return res.json();
    },
  });

  
  const pendingDonations = donations.filter(donation => donation.status === 'pending');

  const handleView = (id) => {
   
    navigate(`/donationreq/all/${id}`);

  };

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error.message}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Pending Donation Requests</h2>

      {pendingDonations.length === 0 ? (
        <p className="text-center text-gray-600">No pending donation requests found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {pendingDonations.map(({ _id, recipientName, fullAddress, bloodGroup, donationDate, donationTime }) => (
            <motion.div
              key={_id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">{recipientName}</h3>

                <p className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-red-600" /> Location: {fullAddress}
                </p>

                <p className="flex items-center text-red-600 font-bold text-lg">
                  <FaTint className="mr-2" /> Blood Group: {bloodGroup}
                </p>

                <p className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2" /> Date: {donationDate}
                </p>

                <p className="flex items-center text-gray-700">
                  <FaClock className="mr-2" /> Time: {donationTime}
                </p>
              </div>

              <button
                onClick={() => handleView(_id)}
                className="mt-6 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300 font-semibold"
              >
                <FaEye /> View
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Donationreqall;
