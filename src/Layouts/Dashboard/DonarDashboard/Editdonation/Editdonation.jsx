import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../providers/AuthProvider";


const Editdonation = () => {
  const { id } = useParams();
 const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDivition, setSelectedDivition] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  // Get 
  const { data: donationData, isLoading, error } = useQuery({
    queryKey: ["donation", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/createdonation/users/${id}`);
      if (!res.ok) throw new Error("Donation not found");
      return res.json();
    },
  });

  // Fetch 
  const { data: bloodGroups = [] } = useQuery({
    queryKey: ["bloodGroups"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/bloodgroup");
      return res.json();
    },
  });

  const { data: divisions = [] } = useQuery({
    queryKey: ["divisions"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/division");
      return res.json();
    },
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", selectedDivition],
    enabled: !!selectedDivition,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/district?division=${selectedDivition}`);
      return res.json();
    },
  });

  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazilas", selectedDistrict],
    enabled: !!selectedDistrict,
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/upazila?district=${selectedDistrict}`);
      return res.json();
    },
  });

  useEffect(() => {
    if (donationData) {
      setSelectedGroup(donationData.bloodGroup || "");
      setSelectedDivition(donationData.division || "");
      setSelectedDistrict(donationData.district || "");
      setSelectedUpazila(donationData.upazila || "");
    }
  }, [donationData]);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      name: donationData?.name || "",
      recipientName: donationData?.recipientName || "",
      hospitalName: donationData?.hospitalName || "",
      donationDate: donationData?.donationDate || "",
      donationTime: donationData?.donationTime || "",
      fullAddress: donationData?.fullAddress || "",
      requestMessage: donationData?.requestMessage || "",
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};
      if (!values.recipientName) errors.recipientName = "Recipient name is required";
      if (!values.hospitalName) errors.hospitalName = "Hospital name is required";
      if (!values.donationDate) errors.donationDate = "Donation date is required";
      if (!values.donationTime) errors.donationTime = "Donation time is required";
      if (!values.fullAddress) errors.fullAddress = "Full address is required";
      if (!values.requestMessage) errors.requestMessage = "Request message is required";
      if (!selectedGroup) errors.bloodGroup = "Blood group is required";
      if (!selectedDivition) errors.division = "Division is required";
      if (!selectedDistrict) errors.district = "District is required";
      if (!selectedUpazila) errors.upazila = "Upazila is required";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          bloodGroup: selectedGroup,
          division: selectedDivition,
          district: selectedDistrict,
          upazila: selectedUpazila,
          createdAt: new Date().toISOString(),
          status: "pending",
          role: "donor",
        };

     fetch(`http://localhost:5000/createdonation/users/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),

});

        Swal.fire({
          icon: "success",
          title: "Donation updated!",
        });

       
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Something went wrong.",
        });
      }
    },
  });

  if (isLoading) return <div className="text-center py-10"><span className="loading loading-spinner loading-xl" /></div>;
  if (error) return <div className="text-center text-red-700">Error: {error.message}</div>;

  return (
    <div className="card-body max-w-3xl text-black mx-auto">
     
         <form onSubmit={formik.handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-[#f0ecee]">Edit Donation Request</h2>

        <label className="label">Name</label>
        <input className="input input-bordered w-full" name="name" value={formik.values.name} readOnly />

        <label className="label">Email</label>
        <input className="input input-bordered w-full" name="email" value={formik.values.email} readOnly />

        <label className="label">Recipient Name</label>
        <input className="input input-bordered w-full" name="recipientName" onChange={formik.handleChange} value={formik.values.recipientName} />
        {formik.errors.recipientName && <p className="text-red-500">{formik.errors.recipientName}</p>}

        <label className="label">Hospital Name</label>
        <input className="input input-bordered w-full" name="hospitalName" onChange={formik.handleChange} value={formik.values.hospitalName} />
        {formik.errors.hospitalName && <p className="text-red-500">{formik.errors.hospitalName}</p>}

        <label className="label">Donation Date</label>
        <input type="date" className="input input-bordered w-full" name="donationDate" onChange={formik.handleChange} value={formik.values.donationDate} />
        {formik.errors.donationDate && <p className="text-red-500">{formik.errors.donationDate}</p>}

        <label className="label">Donation Time</label>
        <input type="time" className="input input-bordered w-full" name="donationTime" onChange={formik.handleChange} value={formik.values.donationTime} />
        {formik.errors.donationTime && <p className="text-red-500">{formik.errors.donationTime}</p>}

        <label className="label">Full Address</label>
        <input className="input input-bordered w-full" name="fullAddress" onChange={formik.handleChange} value={formik.values.fullAddress} />
        {formik.errors.fullAddress && <p className="text-red-500">{formik.errors.fullAddress}</p>}

        <label className="label">Division</label>
        <select className="select select-bordered w-full" value={selectedDivition} onChange={(e) => { setSelectedDivition(e.target.value); setSelectedDistrict(""); setSelectedUpazila(""); }}>
          <option disabled value="">Select Division</option>
          {divisions.map((div, i) => <option key={i} value={div.name}>{div.name}</option>)}
        </select>
        {formik.errors.division && <p className="text-red-500">{formik.errors.division}</p>}

        <label className="label">District</label>
        <select className="select select-bordered w-full" value={selectedDistrict} onChange={(e) => { setSelectedDistrict(e.target.value); setSelectedUpazila(""); }} disabled={!districts.length}>
          <option disabled value="">Select District</option>
          {districts.map((dist, i) => <option key={i} value={dist.name}>{dist.name}</option>)}
        </select>
        {formik.errors.district && <p className="text-red-500">{formik.errors.district}</p>}

        
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
        {formik.errors.upazila && <p className="text-red-500">{formik.errors.upazila}</p>}

        <label className="label">Blood Group</label>
        <select className="select select-bordered w-full" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option disabled value="">Select Blood Group</option>
          {bloodGroups.map((group, i) => <option key={i} value={group.group}>{group.group}</option>)}
        </select>
        {formik.errors.bloodGroup && <p className="text-red-500">{formik.errors.bloodGroup}</p>}

        <label className="label">Request Message</label>
        <textarea className="textarea textarea-bordered w-full" name="requestMessage" onChange={formik.handleChange} value={formik.values.requestMessage}></textarea>
        {formik.errors.requestMessage && <p className="text-red-500">{formik.errors.requestMessage}</p>}

        <button type="submit" className="btn bg-[#772c48] hover:bg-[#bc2356] text-white w-full">Update Donation Request</button>
      </form>
          <button
          onClick={() => navigate(-1)}
          className="text-white w-full mb-6 p-2 bg-[#8e3757] rounded-md hover:bg-[#bc2356] transition duration-300"
        >
          &larr; Go Back
        </button>
    </div>
  );
};

export default Editdonation;
