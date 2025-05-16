import React, { useContext } from "react";
import Lottie from "lottie-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import bloodDonationAnimation from "../../../assets/Lotti/Animation - 1742322367473 (1).json";
import { AuthContext } from "../../../providers/AuthProvider";
import SocialLogin from "../../../providers/SocialLogin";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await signIn(values.email, values.password);
        const user = result.user;

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${user.email}`,
        });

        resetForm(); // ✅ ফর্ম রিসেট
        navigate(from, { replace: true }); // ✅ আগের পেজে পাঠাও
      } catch (error) {
        console.error("Login Error:", error);

        if (error.code === "auth/wrong-password") {
          Swal.fire({
            icon: "error",
            title: "Wrong Password",
            text: "The password you entered is incorrect. Please try again.",
          });
        } else if (error.code === "auth/user-not-found") {
          Swal.fire({
            icon: "error",
            title: "User Not Found",
            text: "It seems like you're not registered. Please sign up first.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.message || "Invalid email or password",
          });
        }
      }
    },
  });

  return (
    <div className="hero bg-[#A53860] min-h-screen">
      <div className="hero-content flex-col lg:flex-row justify-between items-center gap-10 w-full px-6">
        {/* Lottie Animation */}
        <div className="hidden lg:block w-[500px]">
          <Lottie animationData={bloodDonationAnimation} loop />
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body">
            <form onSubmit={formik.handleSubmit}>
              <fieldset className="space-y-3">
                <h2 className="text-3xl text-center font-bold text-[#A53860]">Login</h2>

                {/* Email */}
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    autoComplete="current-password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Link to="/forget-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn bg-[#772c48] hover:bg-[#bc2356] text-white w-full"
                >
                  Login
                </button>
              </fieldset>
            </form>

            <div className="divider">OR</div>

            <SocialLogin></SocialLogin>

            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
