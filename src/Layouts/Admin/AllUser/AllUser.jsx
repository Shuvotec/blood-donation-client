import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 5;

const AllUser = () => {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null); // For showing loading on a user row

  // Fetch user data
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/userall')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then(users => {
        setData(users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter users by status
  const filteredUsers = data.filter(user => {
    if (filterStatus === 'all') return true;
    return user.status === filterStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Update user on backend and locally
  const updateUser = async (userId, updates) => {
    try {
      setUpdatingUserId(userId);
      const res = await fetch(`http://localhost:5000/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user');

      const updatedUser = await res.json();

      setData(prev => prev.map(u => (u._id === userId ? updatedUser : u)));
      alert('User updated successfully!');
    } catch (error) {
      alert('Error updating user. Please try again.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
        All Users
      </h1>

      {/* Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="font-semibold text-lg">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={e => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="border border-purple-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-xl font-medium text-purple-700 animate-pulse">Loading users...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-purple-300 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="p-4 border border-purple-400">Avatar</th>
                <th className="p-4 border border-purple-400">Email</th>
                <th className="p-4 border border-purple-400">Name</th>
                <th className="p-4 border border-purple-400">Role</th>
                <th className="p-4 border border-purple-400">Status</th>
                <th className="p-4 border border-purple-400">Blood Group</th>
                <th className="p-4 border border-purple-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-purple-700 font-semibold text-lg">
                    No users found.
                  </td>
                </tr>
              )}

              {paginatedUsers.map(user => (
                <tr key={user._id} className="hover:bg-purple-50">
                  <td className="border border-purple-400 p-2 text-center">
                    <img
                      src={user.imageURL || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="border border-purple-400 p-2">{user.email}</td>
                  <td className="border border-purple-400 p-2">{user.name}</td>
                  <td className="border border-purple-400 p-2 capitalize">{user.role}</td>
                  <td className="border border-purple-400 p-2 capitalize">{user.status}</td>
                  <td className="border border-purple-400 p-2">{user.bloodGroup}</td>
                  <td className="border border-purple-400 p-2 space-x-2 text-center">
                    {user.status === 'active' && (
                      <button
                        onClick={() => updateUser(user._id, { status: 'blocked' })}
                        disabled={updatingUserId === user._id}
                        className={`px-3 py-1 rounded text-white font-semibold transition ${
                          updatingUserId === user._id ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {updatingUserId === user._id ? 'Blocking...' : 'Block'}
                      </button>
                    )}

                    {user.status === 'blocked' && (
                      <button
                        onClick={() => updateUser(user._id, { status: 'active' })}
                        disabled={updatingUserId === user._id}
                        className={`px-3 py-1 rounded text-white font-semibold transition ${
                          updatingUserId === user._id ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {updatingUserId === user._id ? 'Unblocking...' : 'Unblock'}
                      </button>
                    )}

                    {user.role !== 'volunteer' && (
                      <button
                        onClick={() => updateUser(user._id, { role: 'volunteer' })}
                        disabled={updatingUserId === user._id}
                        className={`px-3 py-1 rounded text-white font-semibold transition ${
                          updatingUserId === user._id ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {updatingUserId === user._id ? 'Updating...' : 'Make Volunteer'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-6 flex justify-center items-center space-x-6 text-purple-700 font-semibold">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-purple-400 rounded disabled:opacity-50 hover:bg-purple-200"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-purple-400 rounded disabled:opacity-50 hover:bg-purple-200"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllUser;
