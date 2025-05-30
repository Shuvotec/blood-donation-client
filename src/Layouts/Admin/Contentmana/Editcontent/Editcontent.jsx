import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { FaEdit, FaSave, FaTimes, FaImage, FaCheckCircle, FaClock } from 'react-icons/fa';

const image_hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_Key}`;

const Editcontent = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const editor = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newImage, setNewImage] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogDetails', id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/blogsall/${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!id,
    onSuccess: (data) => setFormData(data),
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`http://localhost:5000/blogsall/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update blog');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogDetails', id]);
      setIsEditing(false);
      Swal.fire('Updated!', 'Blog successfully updated.', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update blog.', 'error');
    },
  });

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await fetch(image_hosting_api, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error?.message || 'Image upload failed');
    return data.data.url;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setNewImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      let updated = { ...formData };
      if (newImage) {
        const imageUrl = await uploadImage(newImage);
        updated.thumbnail = imageUrl;
      }
      mutation.mutate(updated);
    } catch (error) {
      Swal.fire('Error', error.message || 'Image upload failed', 'error');
    }
  };

  if (isLoading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-8">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md mt-10 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-red-600 mb-6 flex items-center gap-2">
        <FaEdit /> Edit Blog
      </h1>

      {isEditing ? (
        <div className="space-y-6">
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Blog Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 text-black"
          />

          <div>
            <label className="block font-semibold mb-2 items-center gap-2 text-slate-700">
              <FaImage /> Thumbnail:
            </label>
            {formData.thumbnail ? (
              <img src={formData.thumbnail} alt="Thumbnail" className="w-40 mb-3 rounded" />
            ) : (
              <p className="text-gray-500 italic">No image available</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block mt-2 text-black"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Content:</label>
            <JoditEditor
              ref={editor}
              value={formData.content || ''}
              tabIndex={1}
              onBlur={handleContentChange}
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Status:</label>
            <select
              name="status"
              value={formData.status || 'draft'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400 text-black"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdate}
              disabled={mutation.isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 transition"
            >
              <FaSave />
              {mutation.isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={mutation.isLoading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium flex items-center gap-2 transition"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-700">Title:</h2>
            <p className="text-gray-800">{data?.title}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-700">Status:</h2>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full font-semibold ${
                data?.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {data?.status === 'published' ? <FaCheckCircle /> : <FaClock />}
              {data?.status}
            </span>
          </div>

          {data?.thumbnail && (
            <div>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Thumbnail:</h2>
              <img src={data.thumbnail} alt="Thumbnail" className="w-40 rounded-md" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-black mb-2">Content:</h2>
            <div
              className="prose prose-slate text-black max-w-none"
              dangerouslySetInnerHTML={{ __html: data?.content || '' }}
            />
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-red-800 px-6 py-2 rounded-md font-medium flex items-center gap-2 transition"
          >
            <FaEdit /> Edit Blog
          </button>
        </div>
      )}
    </div>
  );
};

export default Editcontent;
