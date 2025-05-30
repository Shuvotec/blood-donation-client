import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SearchPage = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/userall');
      return res.data;
    },
  });

  // Fetch blood groups
  const { data: bloodGroups = [] } = useQuery({
    queryKey: ['bloodGroups'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/bloodgroup');
      return res.json();
    },
  });

  // Fetch divisions
  const { data: divisions = [] } = useQuery({
    queryKey: ['divisions'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/division');
      return res.json();
    },
  });

  // Fetch districts 
  const { data: districts = [] } = useQuery({
    queryKey: ['districts', selectedDivision],
    enabled: !!selectedDivision,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/district?division=${selectedDivision}`);
      return res.json();
    },
  });

  // Fetch upazilas
  const { data: upazilas = [] } = useQuery({
    queryKey: ['upazilas', selectedDistrict],
    enabled: !!selectedDistrict,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/upazila?district=${selectedDistrict}`);
      return res.json();
    },
  });

 
  useEffect(() => {
    if (users.length > 0) {
      const activeUsers = users.filter(user => user.status === 'active');
      setFilteredDonors(activeUsers);
    }
  }, [users]);

  // Search handler
  const handleSearch = () => {
    const filtered = users.filter(user =>
      user.status === 'active' &&
      (selectedBloodGroup ? user.bloodGroup === selectedBloodGroup : true) &&
      (selectedDivision ? user.division === selectedDivision : true) &&
      (selectedDistrict ? user.district === selectedDistrict : true) &&
      (selectedUpazila ? user.upazila === selectedUpazila : true)
    );
    setFilteredDonors(filtered);
  };

  const openModal = (donor) => {
    setSelectedDonor(donor);
  };

  const closeModal = () => {
    setSelectedDonor(null);
  };

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error loading data.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Search Blood Donors</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Blood Group */}
        <select
          className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedBloodGroup}
          onChange={e => setSelectedBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg._id} value={bg.group}>
              {bg.group}
            </option>
          ))}
        </select>

        {/* Division */}
        <select
          className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDivision}
          onChange={e => {
            setSelectedDivision(e.target.value);
            setSelectedDistrict('');
            setSelectedUpazila('');
          }}
        >
          <option value="">Select Division</option>
          {divisions.map(d => (
            <option key={d._id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDistrict}
          onChange={e => {
            setSelectedDistrict(e.target.value);
            setSelectedUpazila('');
          }}
          disabled={!selectedDivision}
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d._id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Upazila */}
        <select
          className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedUpazila}
          onChange={e => setSelectedUpazila(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Select Upazila</option>
          {upazilas.map(u => (
            <option key={u._id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-10">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-6 text-center">Results</h3>
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredDonors.map(user => (
              <div
                key={user.email}
                className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-xl transition-shadow"
              >
                <img
                  src={user.imageURL}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-red-500"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">{user.bloodGroup}</span> — {user.upazila}, {user.district}, {user.division}
                  </p>
                </div>
                <button
                  onClick={() => openModal(user)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-500">No donors found matching the criteria.</p>
        )}
      </div>

      {selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none"
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="flex flex-col items-center gap-4">
              <img
                src={selectedDonor.imageURL}
                alt={selectedDonor.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-red-500"
              />
              <h2 className="text-2xl font-bold">{selectedDonor.name}</h2>
              <p><strong>Email:</strong> {selectedDonor.email}</p>
              <p><strong>Blood Group:</strong> {selectedDonor.bloodGroup}</p>
              <p><strong>Division:</strong> {selectedDonor.division}</p>
              <p><strong>District:</strong> {selectedDonor.district}</p>
              <p><strong>Upazila:</strong> {selectedDonor.upazila}</p>
              {selectedDonor.createdAt && (
                <p><strong>Joined:</strong> {formatDate(selectedDonor.createdAt)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: scale(0.95);}
          to {opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
