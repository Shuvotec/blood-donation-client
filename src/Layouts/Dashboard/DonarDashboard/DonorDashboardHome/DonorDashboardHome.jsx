
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Mydonationrequests from '../Donationrequests/Mydonationrequests';


Modal.setAppElement('#root');

const DonorDashboardHome = () => {





  return (
    <div className="p-6 bg-[#ad3457] text-white min-h-screen text-center">
      <Mydonationrequests></Mydonationrequests>

      <h2 className='text-3xl text-center py-10'>Your Donation Request</h2>
      <Link className='btn' to='/dashboard/create-donation-request'>Create-Donation-Request</Link>

    </div>
  );
};

export default DonorDashboardHome;
