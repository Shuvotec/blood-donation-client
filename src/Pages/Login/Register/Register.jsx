import React, { useContext, useState } from "react";
import Lottie from "lottie-react";
import bloodDonationAnimationR from "../../../assets/Lotti/Animation - 1742663373519.json";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2"; 
import { AuthContext } from "../../../providers/AuthProvider";

const image_hosting_Key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_Key}`;

const Register = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDivition, setSelectedDivition] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [imageURL, setImageURL] = useState("");
  const { createuser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      const res = await fetch(
        `http://localhost:5000/district?division=${selectedDivition}`
      );
      return res.json();
    },
  });

  // Fetch Upazilas
  const { data: upazilas = [] } = useQuery({
    queryKey: ["upazilas", selectedDistrict],
    enabled: !!selectedDistrict,
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/upazila?district=${selectedDistrict}`
      );
      return res.json();
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      image: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      name: Yup.string().required("Name is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Minimum 8 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "Must include uppercase, lowercase, number, and special character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("image", values.image);

        const res = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const uploadedURL = data?.data?.display_url;
        setImageURL(uploadedURL);

        const createdAt = new Date().toISOString();  
        

        const status = "active";
        const role = "donor";
        const formPayload = {
          email: values.email,
          name: values.name,
          imageURL: uploadedURL,
          bloodGroup: selectedGroup,
          password: values.password,
          division: selectedDivition,
          district: selectedDistrict,
          upazila: selectedUpazila,
          createdAt: createdAt,
          status: status,
          role: role
        };



        const response = await fetch("http://localhost:5000/userall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formPayload),  
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User registered successfully", result);

          createuser(formPayload.email, formPayload.password)
            .then((result) => {
              const loggedUser = result.user;
              console.log(loggedUser);
              updateUserProfile(formPayload.name, formPayload.imageURL)
                .then(() => {
                  console.log("User profile updated successfully");
                  resetForm();
                  navigate(from, { replace: true });
                })
                .catch((error) => console.log(error));
            });

          Swal.fire({
            icon: "success",
            title: "Your Registration Successful!",
            text: `Welcome, ${formPayload?.name}!`,
          });

          resetForm();
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

  const handleFileChange = (e) => {
    formik.setFieldValue("image", e.currentTarget.files[0]);
  };

  return (
    <div className="hero bg-[#ac2859] min-h-screen">
      <div className="hero-overlay bg-opacity-20 text-white text-5xl hidden md:block font-bold font-serif md:py-10 md:pl-20">Register Now</div>
      <div className="hero-content md:pt-20 flex-col lg:flex-row md:space-x-40">
        <div className="text-center md:w-[700px] flex justify-center items-center">
          <div className="hidden md:block">
            <Lottie animationData={bloodDonationAnimationR} loop />
          </div>
        </div>

        <div className="card bg-base-100 w-full shadow-2xl text-black">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit} className="space-y-3 ">
              <h2 className="text-center text-2xl font-bold text-[#ac2859] block md:hidden">
                Register
              </h2>

              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name && (
                <div className="text-red-500">{formik.errors.name}</div>
              )}

              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}

              <label className="label">Upload Image</label>
              <input
                type="file"
                className="file-input w-full bg-[#ffffff] file-input-bordered "
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formik.errors.image && formik.touched.image && (
                <div className="text-red-500">{formik.errors.image}</div>
              )}

              <label className="label">Blood Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Your Blood Group
                </option>
                {bloodGroups.map((group, i) => (
                  <option key={i} value={group.group}>
                    {group.group}
                  </option>
                ))}
              </select>

              <label className="label">Division</label>
              <select
                value={selectedDivition}
                onChange={(e) => {
                  setSelectedDivition(e.target.value);
                  setSelectedDistrict("");
                  setSelectedUpazila("");
                }}
                className="select select-bordered w-full"
                required
              >
                <option disabled value="">
                  Select Division
                </option>
                {divisions.map((div, i) => (
                  <option key={i} value={div.name}>
                    {div.name}
                  </option>
                ))}
              </select>

              <label className="label">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila("");
                }}
                className="select select-bordered w-full"
                disabled={!districts.length}
                required
              >
                <option disabled value="">
                  Select District
                </option>
                {districts.map((dist, i) => (
                  <option key={i} value={dist.name}>
                    {dist.name}
                  </option>
                ))}
              </select>

              <label className="label">Upazila</label>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="select select-bordered w-full"
                required
                disabled={!upazilas.length}
              >
                <option disabled value="">
                  Select Upazila
                </option>
                {upazilas.map((upa, i) => (
                  <option key={i} value={upa.name || upa}>
                    {upa.name || upa}
                  </option>
                ))}
              </select>

              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500">{formik.errors.password}</div>
              )}

              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <div className="text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                )}

              <button
                type="submit"
                className="btn bg-[#772c48] hover:bg-[#bc2356] text-white w-full"
              >
                Register
              </button>
            </form>

            <p className="my-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
