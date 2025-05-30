import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft } from 'react-icons/fa';

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

  if (isLoading) return <p className="text-center mt-8">Loading blog...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error.message}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <FaArrowLeft /> Back to Blogs
      </button>

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      {blog.imageURL && (
        <img
          src={blog.imageURL}
          alt={blog.title}
          className="w-full h-auto rounded mb-6 object-cover"
        />
      )}

      <article className="prose max-w-none text-gray-800 whitespace-pre-wrap">
        {blog.content}
      </article>
    </div>
  );
};

export default Blogdetails;
