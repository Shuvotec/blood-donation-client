import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ALL_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const PAGE_SIZE = 5;

const MyDonationreq = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, active
  const [filterBloodGroup, setFilterBloodGroup] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: donationRequests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['createdonation'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/createdonation', {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch donation requests');
      return res.json();
    },
  });

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'active' : 'pending';

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Change status to ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, change to ${newStatus}`,
      confirmButtonColor: newStatus === 'active' ? '#16a34a' : '#dc2626',
      cancelButtonColor: '#6b7280',
    });

    if (!confirm.isConfirmed) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/createdonation/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errMessage = await res.text();
        throw new Error(errMessage || 'Failed to update status');
      }

      await Swal.fire({
        title: 'Updated!',
        text: `Status changed to ${newStatus}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });

      await refetch();
    } catch (err) {
      Swal.fire('Error!', 'Could not update status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter donation requests by status and blood group
  const filteredRequests = donationRequests.filter((req) => {
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    const bloodGroupMatch = filterBloodGroup === 'all' || req.bloodGroup === filterBloodGroup;
    return statusMatch && bloodGroupMatch;
  });

  // Pagination calculations
  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paginatedRequests = filteredRequests.slice(startIdx, startIdx + PAGE_SIZE);

  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (isLoading)
    return <p className="text-center text-white py-6">Loading...</p>;

  if (error)
    return (
      <p className="text-center text-red-200 py-6">
        Error: {error.message}
      </p>
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-red-900 text-white font-sans">
      <h2 className="text-3xl font-bold text-center mb-8">
        Donation Requests
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-red-600 text-white px-3 py-2 rounded font-medium text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
        </select>

        {/* Blood Group Filter */}
        <select
          value={filterBloodGroup}
          onChange={(e) => {
            setFilterBloodGroup(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-red-600 text-white px-3 py-2 rounded font-medium text-sm"
        >
          <option value="all">All Blood Groups</option>
          {ALL_BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-red-800 shadow-lg rounded-lg max-w-full mx-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Donor</th>
              <th className="px-3 py-2 text-left">Recipient</th>
              <th className="px-3 py-2 text-left hidden md:table-cell">Hospital</th>
              <th className="px-3 py-2 text-left hidden md:table-cell">Blood Group</th>
              <th className="px-3 py-2 text-left hidden lg:table-cell">Date</th>
              <th className="px-3 py-2 text-left hidden lg:table-cell">Time</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRequests.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-yellow-300"
                >
                  No donation requests found.
                </td>
              </tr>
            )}

            {paginatedRequests.map((req, index) => (
              <tr key={req._id} className="hover:bg-red-600">
                <td className="px-3 py-2">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </td>
                <td className="px-3 py-2">{req.name}</td>
                <td className="px-3 py-2">{req.recipientName}</td>
                <td className="px-3 py-2 hidden md:table-cell">{req.hospitalName}</td>
                <td className="px-3 py-2 hidden md:table-cell">{req.bloodGroup}</td>
                <td className="px-3 py-2 hidden lg:table-cell">{req.donationDate}</td>
                <td className="px-3 py-2 hidden lg:table-cell">{req.donationTime}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === 'active'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleStatusToggle(req._id, req.status)}
                    disabled={updatingId !== null}
                    className={`${
                      updatingId !== null
                        ? 'bg-gray-400 cursor-not-allowed'
                        : req.status === 'pending'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    } text-white px-3 py-1 rounded text-xs`}
                  >
                    {updatingId === req._id
                      ? 'Updating...'
                      : req.status === 'pending'
                      ? 'Mark Active'
                      : 'Mark Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-white">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? 'bg-red-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            aria-label="Previous page"
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Pages */}
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded ${
                  pageNum === currentPage
                    ? 'bg-green-600 font-bold'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? 'bg-red-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            aria-label="Next page"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDonationreq;
