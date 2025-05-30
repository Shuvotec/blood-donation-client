import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

const Viewallrequest = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  const { data: donationRequests = [], isLoading, error, refetch } = useQuery({
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

  const displayedRequests = showAll
    ? donationRequests.slice().reverse()
    : donationRequests.slice(-3).reverse();

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/createdonation/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update donation status');
      refetch(); 
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:5000/createdonation/${requestId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete donation request');
      refetch(); 
    } catch (error) {
      console.error('Error deleting donation request:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };
  const handleEditrequest = (id) => {
    navigate(`edit-donation-request/${id}`);
    console.log(id);
  }

  console.log(donationRequests.length)

  return (
    <div className="md:mb-20">
      <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>

      {donationRequests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
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
              {displayedRequests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{request.recipientName}</td>
                  <td>{`${request.district}, ${request.upazila}`}</td>
                  <td>{request.donationDate}</td>
                  <td>{request.donationTime}</td>
                  <td>{request.bloodGroup}</td>
                  <td>{request.status}</td>
                  <td className="space-x-1">
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

                    <Link to={`/dashboard/edit-donation-request/${request._id}`}>
                      <button className="btn btn-ghost btn-xs">Edit</button>
                    </Link>


                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => {
                        setDeleteRequestId(request._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                    <Link to={`/dashboard/donation-details/${request._id}`}>
                      <button className="btn btn-ghost btn-xs">Details</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {donationRequests.length > 3 && (
            <div className="mt-4 text-center">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "View All Requests"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          No donation requests found.
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this request?</h3>
            <div className="flex justify-end space-x-4">
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleDelete(deleteRequestId)}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewallrequest;
