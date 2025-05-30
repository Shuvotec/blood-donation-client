import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { MdOutlineAccessTime } from 'react-icons/md';
import { motion } from 'framer-motion';

const Blogdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/blogsall/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog details');
      return res.json();
    },
  });

  if (isLoading)
    return (
      <p className="text-center mt-12 text-lg font-semibold text-gray-600 animate-pulse">
        Loading blog...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-12 text-red-500 font-semibold">{error.message}</p>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl mt-12 p-8
                 border border-gray-200
                 hover:shadow-2xl transition-shadow duration-500"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.7 }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-indigo-600 hover:text-indigo-800 font-semibold mb-8"
      >
        <FaArrowLeft className="text-xl" /> Back to Blogs
      </button>

      <div className="flex items-center gap-5 mb-8">
        <motion.img
          src={blog.userimage}
          alt={blog.name}
          className="w-14 h-14 rounded-full border-2 border-indigo-300 shadow-md"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <div>
          <p className="text-lg font-bold text-gray-900">{blog.name}</p>
          <p className="text-sm text-gray-500">{blog.email}</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold
              ${
                blog.role === 'admin'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
          >
            {blog.role.toUpperCase()}
          </span>
        </div>
      </div>

      <h1 className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
        {blog.title}
      </h1>

      <div className="flex items-center gap-2 text-gray-500 mb-10">
        <MdOutlineAccessTime className="text-2xl" />
        <time className="text-sm">{new Date(blog.createdAt).toLocaleDateString()}</time>

        <span
          className={`ml-auto px-4 py-1 rounded-full font-semibold text-sm
            ${
              blog.status === 'publish'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
        >
          {blog.status.toUpperCase()}
        </span>
      </div>

      {blog.thumbnail && (
        <motion.img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full rounded-xl mb-10 shadow-lg max-h-[450px] object-cover cursor-pointer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 30px rgba(99, 102, 241, 0.4)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}

      <article className="prose prose-indigo prose-lg max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
        {blog.content}
      </article>

      <div className="flex justify-end mt-12">
        <motion.button
          className="text-red-600 hover:text-red-700 text-4xl focus:outline-none"
          whileTap={{ scale: 0.8 }}
          aria-label="Like blog"
          title="Like"
        >
          <FaHeart />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Blogdetails;
