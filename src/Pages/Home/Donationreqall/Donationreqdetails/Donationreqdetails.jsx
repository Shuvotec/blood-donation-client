import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft, FaHospital, FaMapMarkerAlt, FaTint, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const Donationreqdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: donation, isLoading, error } = useQuery({
    queryKey: ['donation', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/createdonation/${id}`);
      if (!res.ok) throw new Error('Failed to fetch donation details');
      return res.json();
    },
  });

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error.message}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>

      <div className="space-y-4 text-gray-800">
        <p className="flex items-center gap-2"><FaUser className="text-red-600" /> <strong>Recipient Name:</strong> {donation.recipientName}</p>
        <p className="flex items-center gap-2"><FaHospital className="text-red-600" /> <strong>Hospital Name:</strong> {donation.hospitalName}</p>
        <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-600" /> <strong>Location:</strong> {donation.fullAddress}, {donation.upazila}, {donation.district}, {donation.division}</p>
        <p className="flex items-center gap-2"><FaTint className="text-red-600" /> <strong>Blood Group:</strong> {donation.bloodGroup}</p>
        <p className="flex items-center gap-2"><FaCalendarAlt className="text-red-600" /> <strong>Date:</strong> {donation.donationDate}</p>
        <p className="flex items-center gap-2"><FaClock className="text-red-600" /> <strong>Time:</strong> {donation.donationTime}</p>
        <p><strong>Request Message:</strong> {donation.requestMessage}</p>
        <p><strong>Contact Email:</strong> {donation.email}</p>
      </div>
    </div>
  );
};

export default Donationreqdetails;
