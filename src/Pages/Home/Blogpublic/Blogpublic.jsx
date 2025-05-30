import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const Blogpublic = () => {
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/blogsall');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return res.json();
    },
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs
    .filter(blog => (blog.status || '').toLowerCase() === 'published')
    .filter(blog =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) return <p className="text-center mt-8">Loading blogs...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Published Blogs</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.map(blog => (
            <div
              key={blog._id}
              className="p-4 border rounded shadow hover:shadow-lg transition duration-300 bg-white"
            >
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
              <p className="text-gray-700 mb-3 text-sm">
                {blog.summary || (blog.content?.slice(0, 100) + '...')}
              </p>
              <Link
                to={`/blog/${blog._id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogpublic;
