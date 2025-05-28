import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaSearch, FaPlus, FaTrashAlt, FaEdit, FaSyncAlt } from 'react-icons/fa';

const BlogManager = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: blogs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/blogsall');
      if (!res.ok) throw new Error('Error fetching blogs');
      return res.json();
    },
  });

  const handleStatusChange = async (id, status) => {
    const action = status === 'published' ? 'Publish' : 'Unpublish';

    const result = await Swal.fire({
      title: `Confirm ${action}?`,
      text: `Do you want to ${action.toLowerCase()} this blog?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5', // Indigo-600
      cancelButtonColor: '#EF4444', // Red-500
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/blogs/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        refetch();
        Swal.fire(`${action}ed!`, `Blog has been ${status}.`, 'success');
      } catch {
        Swal.fire('Error!', `Failed to ${status} blog.`, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This blog will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444', // Red-500
      cancelButtonColor: '#4F46E5', // Indigo-600
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/blogs/${id}`, {
          method: 'DELETE',
        });
        refetch();
        Swal.fire('Deleted!', 'The blog has been deleted.', 'success');
      } catch {
        Swal.fire('Error!', 'Failed to delete the blog.', 'error');
      }
    }
  };

  const filteredBlogs = blogs
    .filter((blog) => (filter === 'all' ? true : blog.status === filter))
    .filter((blog) => blog.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700">Blog Manager</h1>
        <button
          onClick={() => navigate('/dashboard/content-management/add-blog')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white font-semibold px-6 py-3 rounded-md shadow transition"
          aria-label="Add New Blog"
        >
          <FaPlus size={18} />
          Add New Blog
        </button>
      </header>

      {/* Filters & Search */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-5 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            aria-label="Filter blogs by status"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-400 text-white rounded-md shadow transition"
            aria-label="Refresh blog list"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="relative w-full sm:w-1/3">
          <input
            type="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            aria-label="Search blogs by title"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </section>

      {/* Blog Table */}
      <section>
        {isLoading ? (
          <p className="text-center text-gray-500 py-10"><span className="loading loading-spinner loading-xl"></span></p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">Failed to load blogs.</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No blogs found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow bg-white border border-gray-200">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-indigo-700">Title</th>
                  <th className="p-4 text-left text-sm font-semibold text-indigo-700">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-indigo-700">Created</th>
                  <th className="p-4 text-right text-sm font-semibold text-indigo-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                    title={`View details of "${blog.title}"`}
                  >
                    <td className="p-4 text-gray-800 font-medium">{blog.title}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-right space-x-3">
                      {blog.status === 'draft' ? (
                        <button
                          onClick={() => handleStatusChange(blog._id, 'published')}
                          className="text-green-600 hover:text-green-800 font-semibold text-sm"
                          title="Publish Blog"
                          aria-label="Publish Blog"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(blog._id, 'draft')}
                          className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm"
                          title="Unpublish Blog"
                          aria-label="Unpublish Blog"
                        >
                          Unpublish
                        </button>
                      )}

                      <button
                        onClick={() =>
                          navigate(`/dashboard/content-management/Edit-blog/${blog._id}`)
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-lg"
                        title="Edit Blog"
                        aria-label="Edit Blog"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-800 text-lg"
                        title="Delete Blog"
                        aria-label="Delete Blog"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogManager;
