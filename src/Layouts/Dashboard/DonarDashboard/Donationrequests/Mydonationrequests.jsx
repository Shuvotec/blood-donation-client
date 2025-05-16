import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const DonorDashboardHome = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;

  // Manage modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  // Fetch the donor's recent donation requests
  const { data: donationRequests = [], isLoading, error } = useQuery({
    queryKey: ['createdonation', email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/createdonation/${email}`);
      if (!res.ok) throw new Error('Failed to fetch donation requests');
      return res.json();
    },
    enabled: !!email,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Function to handle status change
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/createdonation/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update donation status');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Function to handle delete action
  const handleDelete = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/createdonation/${requestId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete donation request');
      // Refetch donation requests or update state
    } catch (error) {
      console.error('Error deleting donation request:', error);
    } finally {
      setShowDeleteModal(false); // Close the modal after action
    }
  };

  return (
    <div className="md:mb-20">
      <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>

      {/* Recent Donations Table */}
      {donationRequests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Recipient Location</th>
                <th>Donation Date</th>
                <th>Donation Time</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.recipientName}</td>
                  <td>{`${request.district}, ${request.upazila}`}</td>
                  <td>{request.donationDate}</td>
                  <td>{request.donationTime}</td>
                  <td>{request.bloodGroup}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.status === 'inprogress' && (
                      <>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleStatusChange(request._id, 'done')}
                        >
                          Done
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleStatusChange(request._id, 'canceled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <Link to={`/edit-donation/${request._id}`}>
                      <button className="btn btn-ghost btn-xs">Edit</button>
                    </Link>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => { setShowDeleteModal(true); setDeleteRequestId(request._id); }}
                    >
                      Delete
                    </button>
                    <Link to={`/donation-details/${request._id}`}>
                      <button className="btn btn-ghost btn-xs">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
              {donationRequests.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">No recent donation requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View All Requests Button */}
      {donationRequests.length > 0 && (
        <Link to="/my-donations">
          <button className="btn btn-primary mt-4">View My All Requests</button>
        </Link>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={() => handleDelete(deleteRequestId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default DonorDashboardHome;
