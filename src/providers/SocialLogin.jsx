import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider'; 
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SocialLogin = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(result => {
        const loggedUser = result.user;
        const savedUser = {
          name: loggedUser?.displayName,
          email: loggedUser?.email,
          imageURL: loggedUser?.photoURL,
          status: "active",
          role: "donor",
          createdAt: new Date().toISOString(),
        };

        fetch(`http://localhost:5000/userall?email=${encodeURIComponent(loggedUser.email)}`)
          .then(res => res.json())
          .then(data => {
            if (!data || data.length === 0) {
              return fetch("http://localhost:5000/userall", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(savedUser)
              });
            }
          })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: `Welcome, ${loggedUser.displayName}!`,
            });
            navigate(from, { replace: true });
          })
          .catch(error => {
            console.error("Saving user failed:", error);
            Swal.fire({
              icon: "error",
              title: "Login Error",
              text: "User login failed while saving. Please try again.",
            });
          });
      })
      .catch(error => {
        console.error("Google login failed:", error);
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: error.message,
        });
      });
  };

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 bg-white text-black rounded hover:bg-gray-100 transition"
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.2 0 6.1 1.2 8.3 3.1l6.2-6.2C34.4 2.1 29.5 0 24 0 14.6 0 6.6 5.7 2.9 13.9l7.4 5.7C12.1 13 17.5 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.5-.1-2.9-.4-4.2H24v8h12.7c-.5 2.7-2 4.9-4.2 6.4l6.6 5.2C43.8 36 46.5 30.8 46.5 24.5z"
          />
          <path
            fill="#FBBC05"
            d="M10.3 28.5C9.3 26.4 8.8 24.1 8.8 21.7c0-2.4.5-4.7 1.5-6.8l-7.4-5.7C1.2 14.6 0 19.2 0 24s1.2 9.4 3.3 13.1l7-8.6z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.5 0 11.9-2.1 15.8-5.6l-7-8.6c-2.1 1.4-4.9 2.2-8.8 2.2-6.5 0-12.1-4.3-14.1-10.2l-7.4 5.7C6.6 42.3 14.6 48 24 48z"
          />
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
