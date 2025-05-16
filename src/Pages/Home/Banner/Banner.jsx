import React from 'react';
import { BiSolidDonateBlood } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { MdNavigateNext } from 'react-icons/md';
import BannerIst from '../../../assets/Banner/27577819_ravi24_may_8.jpg'
import { FaHeartCircleCheck } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className=''>
            <div
                className="hero md:h-[600px]"
                style={{
                    backgroundImage:`url(${BannerIst})`,
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">  Donate <span className=' text-[#d65252]'>Bl<span className='text-[#E83F25]'>oo</span>d</span>, Save  Lives

                        </h1>
                        <p className="mb-5 text-[#ffffff]">
                        Join thousands of donors who are making a real impact. Safe. Voluntary. Lifesaving. Your contribution can bring someone back to life.

                        </p>
                        <div className='gap-5 flex justify-center flex-col md:flex-row'>
                         
                           <Link to="/register" className="btn bg-red-500 text-white flex font-bold font-serif py-5">Join as a donor <BiSolidDonateBlood className='text-2xl mb-2' /> <MdNavigateNext className='text-5xl' />
                           </Link>
                          
                            
                            <button className="btn bg-red-500 px-10 text-white flex font-bold font-serif py-5">Search Donors<FaSearch className='text-xl' />
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;