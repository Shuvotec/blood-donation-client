import React, { useContext } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { MdBloodtype } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const email = user?.email;

  const handleLogOut = () => {
    logOut()
      .then(() => { })
      .catch(error => console.log(error));
  };

  const navbarcr = (
    <>
      <li className='text-xl font-bold font-serif'>
        <Link to="/">Home</Link>
      </li>
      
      <li className='text-xl font-bold font-serif'>
        <Link to="donationreq/all">Donation Requests</Link>
      </li>
      <li className='text-xl font-bold font-serif'>
        <Link to="allsearch/donar">Search</Link>
      </li>
      <li className='text-xl font-bold font-serif'>
        <Link to="/blog">Blog</Link>
      </li>
    </>
  );

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userall/${email}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!email,
  });

  return (
    <div className='pb-20 md:mb-2'>
      <div className="navbar bg-[#ee2405be] bg-opacity-20 text-white md:px-20 py-4 backdrop-blur-sm fixed top-0 left-0 right-0 shadow-lg z-20">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-[#E83F25] text-black"
            >
              {navbarcr}
            </ul>
          </div>
          <Link to='/' className="2xl md:text-4xl font-serif text-center ">
            <div className='text-[#85193C] font-bold flex'>
              Bl<MdBloodtype /><MdBloodtype />d
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {navbarcr}
          </ul>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="flex gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar avatar-online"
                >
                  <div className="w-10 rounded-full">
                    {isLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <img
                        alt="User avatar"
                        src={userData?.imageURL || "/default-avatar.png"}
                      />
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-red-500 rounded-box text-3xl z-10 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <h3>Name: {userData?.name || "No User Name"}</h3>
                  </li>
                  <li>
                    <Link to='/dashboard' className="justify-between">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link>Edit</Link>
                  </li>
                  <li onClick={handleLogOut}>
                    <Link>Logout</Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to='/login'>
              <button className="btn btn-active btn-link text-xl text-white">
                <AiOutlineUser /> Login / Register
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
