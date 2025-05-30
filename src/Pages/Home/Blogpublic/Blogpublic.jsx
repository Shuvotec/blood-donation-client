import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/blogsall');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return res.json();
    },
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Filter blogs by search term (optional)
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-center mt-8">Loading blogs...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error.message}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Published Blogs</h1>

      {/* Optional Search */}
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
        <ul className="space-y-6">
          {filteredBlogs.map(blog => (
            <li
              key={blog._id}
              className="p-6 border rounded shadow hover:shadow-lg transition duration-300 bg-white"
            >
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-700 mb-4">{blog.summary || blog.content.slice(0, 150) + '...'}</p>
              <Link
                to={`/blog/${blog._id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Read More &rarr;
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogList;
