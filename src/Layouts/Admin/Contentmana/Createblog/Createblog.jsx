import React, { useState, useRef, useContext } from "react";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";
import { FaRegImage, FaBlog, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const image_hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_Key}`;

const Createblog = () => {
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const editor = useRef(null);
  const navigate = useNavigate();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userall/${email}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!email,
  });

  function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setThumbnailUrl(data.data.url);
        Swal.fire("Uploaded!", "Image uploaded successfully.", "success");
      } else {
        Swal.fire("Error", "Image upload failed.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Image upload error.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !thumbnailUrl || !content) {
      Swal.fire("Warning", "Please fill all fields!", "warning");
      return;
    }

 
    const plainTextContent = stripHtml(content);

    const newBlog = {
      email: user?.email,
      userimage: user?.photoURL,
      name: user?.displayName,
      role: userData?.role,
      title,
      thumbnail: thumbnailUrl,
      content: plainTextContent, 
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/blogsall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });

      if (!res.ok) throw new Error("Failed to create blog");

      Swal.fire("Success!", "Blog created successfully!", "success");

     
      setTitle("");
      setThumbnailUrl("");
      setContent("");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-red-50 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white bg-opacity-90 backdrop-blur-sm p-10 sm:p-12 rounded-3xl shadow-xl border border-rose-200">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 transition"
        >
          <FaArrowLeft className="text-lg" />
          Back
        </button>

        <div className="flex items-center mb-10 gap-3">
          <FaBlog size={32} className="text-red-600" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Create a New Blog
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title..."
              className="w-full px-5 py-4 rounded-xl border border-gray-300 text-gray-900 font-medium placeholder-gray-400 focus:ring-4 focus:ring-red-300 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Thumbnail Image
            </label>
            <div className="flex flex-wrap items-center gap-5">
              <label className="flex items-center gap-2 text-red-700 font-medium cursor-pointer hover:underline transition">
                <FaRegImage className="text-xl" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {uploading && (
                <span className="text-sm text-gray-500 animate-pulse">
                  Uploading...
                </span>
              )}
            </div>
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="mt-4 w-72 h-44 object-cover rounded-xl border border-red-300 shadow-md"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              Blog Content
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onChange={(newContent) => setContent(newContent)}
              className="rounded-xl border border-gray-300 text-black"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full shadow-lg transition duration-300 w-full sm:w-auto"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createblog;
