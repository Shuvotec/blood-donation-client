import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FaLock,
  FaUnlock,
  FaUserShield,
  FaUserCheck,
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);
const PAGE_SIZE = 5;

const AllUser = () => {
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:5000/userall")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((users) => {
        setData(users);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users. Please refresh.");
        setLoading(false);
      });
  }, []);

  const filteredUsers = data.filter((user) => {
    const status = (user.status || "").toLowerCase();
    const role = (user.role || "").toLowerCase();

    if (filterStatus === "all") return true;

    if (filterStatus === "active-volunteer") {
      return status === "active" && role === "volunteer";
    }

    return status === filterStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Count users
  const roleCounts = data.reduce((acc, user) => {
    const role = (user.role || "unknown").toLowerCase();
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Update user
  const updateUser = async (userId, updates, actionLabel) => {
    const confirmResult = await MySwal.fire({
      title: `Are you sure you want to ${actionLabel}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setUpdatingUserId(userId);

      let endpoint = `http://localhost:5000/userall/${userId}`;
      if (updates.role === "admin") {
        endpoint = `http://localhost:5000/users/admin/${userId}`;
      }

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedUser = await res.json();

      setData((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );

      MySwal.fire({
        icon: "success",
        title: `${actionLabel} successful!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating user, please try again.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const showUserDetails = (user) => {
    MySwal.fire({
      title: <strong>User Details</strong>,
      html: (
        <div style={{ textAlign: "left" }}>
          <div className="flex justify-center mb-4">
            <img
              src={user.imageURL || "https://via.placeholder.com/100"}
              alt={user.name}
              className="rounded-full w-24 h-24 object-cover border-4 border-indigo-600 shadow-lg"
            />
          </div>
          <p><b>Name:</b> {user.name || "N/A"}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Status:</b> {user.status}</p>
          <p><b>Blood Group:</b> {user.bloodGroup || "N/A"}</p>
          <p><b>Joined:</b> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      ),
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: "Close",
      customClass: {
        popup: "rounded-3xl p-8 shadow-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100",
      },
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 mb-10 select-none">
        User Management Panel
      </h1>

      <div className="flex flex-wrap justify-start items-center gap-6 mb-10">
        <label
          htmlFor="statusFilter"
          className="text-xl font-semibold text-gray-700"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="w-48 py-3 px-4 rounded-xl border-2 border-indigo-400 bg-white text-indigo-900 font-medium
                     shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="active-volunteer">Active Volunteers</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap gap-6 text-indigo-700 font-semibold text-lg select-none">
        {Object.entries(roleCounts).map(([role, count]) => (
          <div
            key={role}
            className="bg-indigo-100 px-4 py-2 rounded-xl shadow-inner"
            title={`Total ${role.charAt(0).toUpperCase() + role.slice(1)}s`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}: {count}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg
            className="animate-spin h-14 w-14 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-14">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-indigo-200">
            <table className="min-w-full divide-y divide-indigo-200 bg-white rounded-2xl">
              <thead className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-700 text-white">
                <tr>
                  {[
                    "Avatar",
                    "Email",
                    "Name",
                    "Role",
                    "Status",
                    "Blood Group",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-14 text-indigo-600 font-semibold text-lg"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={user.imageURL || "https://via.placeholder.com/48"}
                          alt={user.name || "User avatar"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300 shadow"
                        />
                      </td>
                      <td className="px-6 py-4 text-indigo-800 font-medium text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-indigo-800 font-semibold text-sm">
                        {user.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 capitalize text-indigo-700 font-medium text-sm">
                        {(user.role || "").toLowerCase()}
                      </td>
                      <td
                        className={`px-6 py-4 capitalize font-semibold text-sm ${
                          (user.status || "").toLowerCase() === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.status || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-indigo-700 font-medium text-sm">
                        {user.bloodGroup || "N/A"}
                      </td>
                      <td className="px-6 py-4 flex flex-wrap gap-2 items-center">
                        {(user.status || "").toLowerCase() === "active" && (
                          <button
                            onClick={() =>
                              updateUser(user._id, { status: "blocked" }, "Block User")
                            }
                            disabled={updatingUserId === user._id}
                            title="Block User"
                            className="p-2 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user._id ? (
                              <LoadingSpinner />
                            ) : (
                              <FaLock size={18} />
                            )}
                          </button>
                        )}

                        {(user.status || "").toLowerCase() === "blocked" && (
                          <button
                            onClick={() =>
                              updateUser(user._id, { status: "active" }, "Unblock User")
                            }
                            disabled={updatingUserId === user._id}
                            title="Unblock User"
                            className="p-2 rounded-lg bg-green-600 text-white shadow-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user._id ? (
                              <LoadingSpinner />
                            ) : (
                              <FaUnlock size={18} />
                            )}
                          </button>
                        )}

                        {(user.role || "").toLowerCase() !== "admin" && (
                          <button
                            onClick={() =>
                              updateUser(user._id, { role: "admin" }, "Make Admin")
                            }
                            disabled={updatingUserId === user._id}
                            title="Make Admin"
                            className="p-2 rounded-lg bg-yellow-500 text-white shadow-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user._id ? (
                              <LoadingSpinner />
                            ) : (
                              <FaUserShield size={18} />
                            )}
                          </button>
                        )}

                        {(user.role || "").toLowerCase() !== "volunteer" && (
                          <button
                            onClick={() =>
                              updateUser(user._id, { role: "volunteer" }, "Make Volunteer")
                            }
                            disabled={updatingUserId === user._id}
                            title="Make Volunteer"
                            className="p-2 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user._id ? (
                              <LoadingSpinner />
                            ) : (
                              <FaUserCheck size={18} />
                            )}
                          </button>
                        )}

                        {(user.role || "").toLowerCase() !== "donor" && (
                          <button
                            onClick={() =>
                              updateUser(user._id, { role: "donor" }, "Make Donor")
                            }
                            disabled={updatingUserId === user._id}
                            title="Make Donor"
                            className="p-2 rounded-lg bg-pink-600 text-white shadow-md hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user._id ? (
                              <LoadingSpinner />
                            ) : (
                              <FaUserAlt size={18} />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => showUserDetails(user)}
                          title="View Details"
                          className="p-2 rounded-lg bg-indigo-300 text-indigo-900 shadow-md hover:bg-indigo-400 transition"
                        >
                          <FaInfoCircle size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-indigo-700 select-none">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            {[...Array(totalPages).keys()].map((p) => (
              <button
                key={p + 1}
                onClick={() => setPage(p + 1)}
                className={`px-4 py-2 rounded-lg transition ${
                  page === p + 1
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-indigo-100 hover:bg-indigo-200"
                }`}
              >
                {p + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

export default AllUser;
