import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const image_hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_Key}`;

const EditProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDivition, setSelectedDivition] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const { email } = useParams();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userall/${email}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!email,
  });

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
    queryKey: ["districts", selectedDivition || userData?.division],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/district?division=${selectedDivition || userData?.division}`
      );
      return res.json();
    },
    enabled: !!(selectedDivition || userData?.division),
  });

  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazila", selectedDistrict || userData?.district],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/upazila?district=${selectedDistrict || userData?.district}`
      );
      return res.json();
    },
    enabled: !!(selectedDistrict || userData?.district),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: userData?.email || "",
      name: userData?.name || "",
      image: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      name: Yup.string().required("Name is required"),
      image: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save the changes?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      try {
        let uploadedURL = userData?.imageURL;

        if (values.image) {
          const formData = new FormData();
          formData.append("image", values.image);
          const res = await fetch(image_hosting_api, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          uploadedURL = data?.data?.display_url;
        }

        const formPayload = {
          email: values.email,
          name: values.name,
          imageURL: uploadedURL,
          bloodGroup: selectedGroup || userData?.bloodGroup,
          division: selectedDivition || userData?.division,
          district: selectedDistrict || userData?.district,
          upazila: selectedUpazila || userData?.upazila,
        };

        const response = await fetch(`http://localhost:5000/userall/${email}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formPayload),
        });

        if (response.ok) {
          await queryClient.invalidateQueries(["user", email]);
          Swal.fire({
            icon: "success",
            title: "Profile Updated!",
            text: `Changes saved for ${formPayload.name}.`,
          });
          setIsEditable(false);
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong during update.",
        });
      }
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue("image", e.currentTarget.files[0]);
  };

  if (isLoading || !userData) {
    return (
      <div className="text-center py-10 text-white">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#ac2859] w-full py-10">
      <div className="hero-content flex-col lg:flex-row md:space-x-10 mx-20">
        <div className="card bg-base-100 shadow-2xl text-black w-full max-w-4xl px-10 mx-auto">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-[#ac2859] mb-5">Edit Profile</h2>

              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.name}
                disabled={!isEditable}
              />

              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                value={formik.values.email}
                readOnly
              />

              <div className="avatar avatar-online">
                <div className="w-10 md:w-20 rounded-full">
                  <img src={userData?.imageURL} alt="User" />
                </div>
              </div>

              <label className="label">Upload Image</label>
              <input
                type="file"
                name="image"
                className="file-input w-full bg-white file-input-bordered"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!isEditable}
              />

              <label className="label">Blood Group</label>
              <select
                value={selectedGroup || userData?.bloodGroup || ""}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="select select-bordered w-full"
                disabled={!isEditable}
              >
                <option disabled value="">Select Blood Group</option>
                {bloodGroups.map((group, i) => (
                  <option key={i} value={group.group}>
                    {group.group}
                  </option>
                ))}
              </select>

              <label className="label">Division</label>
              <select
                value={selectedDivition || userData?.division || ""}
                onChange={(e) => {
                  setSelectedDivition(e.target.value);
                  setSelectedDistrict("");
                  setSelectedUpazila("");
                }}
                className="select select-bordered w-full"
                disabled={!isEditable}
              >
                <option disabled value="">Select Division</option>
                {divisions.map((div, i) => (
                  <option key={i} value={div.name}>
                    {div.name}
                  </option>
                ))}
              </select>

              <label className="label">District</label>
              <select
                value={selectedDistrict || userData?.district || ""}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila("");
                }}
                className="select select-bordered w-full"
                disabled={!isEditable || !districts.length}
              >
                <option disabled value="">Select District</option>
                {districts.map((dist, i) => (
                  <option key={i} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>

              <label className="label">Upazila</label>
              <select
                value={selectedUpazila || userData?.upazila || ""}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="select select-bordered w-full"
                disabled={!isEditable || !upazilas.length}
              >
                <option disabled value="">Select Upazila</option>
                {upazilas.map((upa, i) => (
                  <option key={i} value={upa.name || upa}>
                    {upa.name || upa}
                  </option>
                ))}
              </select>

              <div className="text-right pt-4">

                <div className="text-right pt-4">
                  {!isEditable && (
                    <button
                      type="button"
                      onClick={() => setIsEditable(true)}
                      className="btn bg-[#4d2534] hover:bg-[#b0496f] text-white w-full"
                    >
                      Edit
                    </button>
                  )}
                  {isEditable && (
                    <button
                      type="submit"
                      className="btn bg-[#772c48] hover:bg-[#bc2356] text-white w-full"
                    >
                      Save
                    </button>
                  )}
                </div>

              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
