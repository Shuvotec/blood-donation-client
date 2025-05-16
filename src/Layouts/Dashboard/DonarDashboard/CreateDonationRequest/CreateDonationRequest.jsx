import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../providers/AuthProvider";

const CreateDonationRequest = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDivition, setSelectedDivition] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { user } = useContext(AuthContext);
  const { email } = user;

  // Fetch user info
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userall/${email}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!email,
  });

  // Fetch Blood Groups
  const { data: bloodGroups = [] } = useQuery({
    queryKey: ["bloodGroups"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/bloodgroup");
      return res.json();
    },
  });

  // Fetch Divisions
  const { data: divisions = [] } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/division");
      return res.json();
    },
  });

  // Fetch Districts
  const { data: districts = [] } = useQuery({
    queryKey: ["districts", selectedDivition],
    enabled: !!selectedDivition,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/district?division=${selectedDivition}`);
      return res.json();
    },
  });

  // Fetch Upazilas
  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazilas", selectedDistrict],
    enabled: !!selectedDistrict,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/upazila?district=${selectedDistrict}`);
      return res.json();
    },
  });

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      name: userData?.name || "",
      recipientName: "",
      hospitalName: "",
      donationDate: "",
      donationTime: "",
      fullAddress: "",
      requestMessage: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      // Check if the required fields are empty
      if (!values.recipientName) {
        errors.recipientName = "Recipient name is required";
      }
      if (!values.hospitalName) {
        errors.hospitalName = "Hospital name is required";
      }
      if (!values.donationDate) {
        errors.donationDate = "Donation date is required";
      }
      if (!values.donationTime) {
        errors.donationTime = "Donation time is required";
      }
      if (!values.fullAddress) {
        errors.fullAddress = "Full address is required";
      }
      if (!values.requestMessage) {
        errors.requestMessage = "Request message is required";
      }
      if (!selectedGroup) {
        errors.bloodGroup = "Blood group is required";
      }
      if (!selectedDivition) {
        errors.division = "Division is required";
      }
      if (!selectedDistrict) {
        errors.district = "District is required";
      }
      if (!selectedUpazila) {
        errors.upazila = "Upazila is required";
      }

      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const createdAt = new Date().toISOString();
        const status = "panding";
        const role = "donor";

        const formPayload = {
          email: values.email,
          name: values.name,
          recipientName: values.recipientName,
          hospitalName: values.hospitalName,
          donationDate: values.donationDate,
          donationTime: values.donationTime,
          fullAddress: values.fullAddress,
          requestMessage: values.requestMessage,
          bloodGroup: selectedGroup,
          division: selectedDivition,
          district: selectedDistrict,
          upazila: selectedUpazila,
          createdAt,
          status,
          role,
        };

        const response = await fetch("http://localhost:5000/createdonation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formPayload),
        });

        if (response.ok) {
          const result = await response.json();
          Swal.fire({
            icon: "success",
            title: "Your Registration Successful!",
            text: `Welcome, ${formPayload.name}!`,
          });

          // Reset formik and states
          resetForm();
          setSelectedGroup("");
          setSelectedDivition("");
          setSelectedDistrict("");
          setSelectedUpazila("");
        } else {
          throw new Error("Registration failed.");
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again.",
        });
      }
    },
  });

  if (isLoading || !userData) {
    return (
      <div className="text-center py-10 text-white">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="hero bg-[#f22470] min-h-screen">
      <div className="hero-overlay bg-opacity-20 text-white text-5xl hidden md:block text-center font-bold font-serif md:py-5 md:pl-20">CreateDonationRequest</div>
      <div className="hero-content md:pt-20 flex-col lg:flex-row md:space-x-40">
        <div className="card bg-[#c33e6f] w-full shadow-2xl text-black">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit} className="space-y-3">
              <h2 className="text-center text-2xl font-bold text-[#9f345b] block md:hidden">CreateDonationRequest</h2>

              <label className="label">Name</label>
              <input name="name" className="input input-bordered w-full" value={formik.values.name} readOnly />

              <label className="label">Email</label>
              <input name="email" className="input input-bordered w-full" value={formik.values.email} readOnly />

              <label className="label">Recipient Name</label>
              <input
                name="recipientName"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.recipientName}
                required
              />
              {formik.errors.recipientName && <div className="text-red-500">{formik.errors.recipientName}</div>}

              <label className="label">Hospital Name</label>
              <input
                name="hospitalName"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.hospitalName}
                required
              />
              {formik.errors.hospitalName && <div className="text-red-500">{formik.errors.hospitalName}</div>}

              <label className="label">Donation Date</label>
              <input
                type="date"
                name="donationDate"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.donationDate}
                required
              />
              {formik.errors.donationDate && <div className="text-red-500">{formik.errors.donationDate}</div>}

              <label className="label">Donation Time</label>
              <input
                type="time"
                name="donationTime"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.donationTime}
                required
              />
              {formik.errors.donationTime && <div className="text-red-500">{formik.errors.donationTime}</div>}

              <label className="label">Full Address</label>
              <input
                name="fullAddress"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.fullAddress}
                required
              />
              {formik.errors.fullAddress && <div className="text-red-500">{formik.errors.fullAddress}</div>}

              <label className="label">Division</label>
              <select
                className="select select-bordered w-full"
                value={selectedDivition}
                onChange={(e) => {
                  setSelectedDivition(e.target.value);
                  setSelectedDistrict("");
                  setSelectedUpazila("");
                }}
                required
              >
                <option disabled value="">Select Division</option>
                {divisions.map((div, i) => (
                  <option key={i} value={div.name}>{div.name}</option>
                ))}
              </select>
              {formik.errors.division && <div className="text-red-500">{formik.errors.division}</div>}

              <label className="label">District</label>
              <select
                className="select select-bordered w-full"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila("");
                }}
                disabled={!districts.length}
                required
              >
                <option disabled value="">Select District</option>
                {districts.map((dist, i) => (
                  <option key={i} value={dist.name}>{dist.name}</option>
                ))}
              </select>
              {formik.errors.district && <div className="text-red-500">{formik.errors.district}</div>}

              <label className="label">Upazila</label>
              <select
                className="select select-bordered w-full"
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                disabled={!upazilas.length}
                required
              >
                <option disabled value="">Select Upazila</option>
                {upazilas.map((upa, i) => (
                  <option key={i} value={upa.name || upa}>{upa.name || upa}</option>
                ))}
              </select>
              {formik.errors.upazila && <div className="text-red-500">{formik.errors.upazila}</div>}

              <label className="label">Blood Group</label>
              <select
                className="select select-bordered w-full"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                required
              >
                <option disabled value="">Select Your Blood Group</option>
                {bloodGroups.map((group, i) => (
                  <option key={i} value={group.group}>{group.group}</option>
                ))}
              </select>
              {formik.errors.bloodGroup && <div className="text-red-500">{formik.errors.bloodGroup}</div>}

              <label className="label">Request Message</label>
              <textarea
                name="requestMessage"
                className="textarea textarea-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.requestMessage}
                placeholder="Enter your request message"
                required
              />
              {formik.errors.requestMessage && <div className="text-red-500">{formik.errors.requestMessage}</div>}

              <button type="submit" className="btn bg-[#772c48] hover:bg-[#bc2356] text-white w-full">
                Create Donation Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
