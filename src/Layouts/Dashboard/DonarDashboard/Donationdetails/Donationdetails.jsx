import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHospital, FaRegEnvelope, FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

const Donationdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const { data: donationData, isLoading, error } = useQuery({
    queryKey: ["donation", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/createdonation/users/${id}`);
      if (!res.ok) throw new Error("Donation not found");
      return res.json();
    },
  });

  const {
    email,
    name,
    recipientName,
    hospitalName,
    donationDate,
    donationTime,
    fullAddress,
    requestMessage,
    bloodGroup,
    division,
    district,
    upazila,
    createdAt,
    status,
    role
  } = donationData || {};

  if (isLoading) return <div className="text-center text-xl font-semibold text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-xl font-semibold text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-[#9f345b] to-[#bc2356] rounded-xl shadow-2xl mt-10 mb-16">
      <div className="bg-white p-8 rounded-lg shadow-lg">
      
        
        <h2 className="text-3xl font-bold text-center text-[#9f345b] mb-8">Donation Details</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaUser className="mr-2" /> Name:</span>
              <span className="text-gray-600">{name}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaUser className="mr-2" /> Recipient Name:</span>
              <span className="text-gray-600">{recipientName}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaRegEnvelope className="mr-2" /> Email:</span>
              <span className="text-gray-600">{email}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaCalendarAlt className="mr-2" /> Donation Date:</span>
              <span className="text-gray-600">{donationDate}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaClock className="mr-2" /> Donation Time:</span>
              <span className="text-gray-600">{donationTime}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaHospital className="mr-2" /> Hospital Name:</span>
              <span className="text-gray-600">{hospitalName}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaMapMarkerAlt className="mr-2" /> Full Address:</span>
              <span className="text-gray-600">{fullAddress}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaMapMarkerAlt className="mr-2" /> Division:</span>
              <span className="text-gray-600">{division}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaMapMarkerAlt className="mr-2" /> District:</span>
              <span className="text-gray-600">{district}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaMapMarkerAlt className="mr-2" /> Upazila:</span>
              <span className="text-gray-600">{upazila}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaCalendarAlt className="mr-2" /> Created At:</span>
            <span className="text-gray-600">{new Date(createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><FaUserShield className="mr-2" /> Role:</span>
              <span className="text-gray-600">{role}</span>
            </div>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex justify-between text-lg font-medium">
           <span className="text-[#9f345b] flex items-center"><FaRegEnvelope className="mr-2" /> Request Message:</span>
              <span className="text-gray-600">{requestMessage}</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span className="text-[#9f345b] flex items-center"><IoIosWarning className="mr-2" /> Status:</span>
              <span className={`text-lg ${status === 'panding' ? 'text-orange-500' : 'text-green-500'}`}>{status}</span>
            </div>
            
          </div>

                  <button
          onClick={() => navigate(-1)} 
          className="text-white w-full mb-6 p-2 bg-[#9f345b] rounded-md hover:bg-[#bc2356] transition duration-300"
        >
          &larr; Go Back
        </button>
        </div>
      </div>
    </div>
  );
};

export default Donationdetails;
