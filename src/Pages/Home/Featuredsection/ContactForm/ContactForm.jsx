import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaCommentDots } from 'react-icons/fa';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert('Message sent successfully!');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="bg-white py-12 px-6 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-10">
        Contact Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
   
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300"
          >
            <FaCommentDots />
            Send Message
          </button>
        </form>

   
        <div className="flex flex-col justify-center gap-6 text-lg text-gray-700">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-red-600 text-xl" />
            <span>+880 1712610216</span>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-red-600 text-xl" />
            <span>+880 1612610216 (24/7 Emergency)</span>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-red-600 text-xl" />
            <span>shuvotec10@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
