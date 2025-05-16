import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../src/Layouts/MainLayout/MainLayout";
import Home from "../src/Pages/Home/Home";
import Login from "../src/Pages/Login/Login/Login";
import Register from "../src/Pages/Login/Register/Register";
import PrivateRoute from "./PrivateRoute";
import CkR from "../src/Pages/CkR";
import EditProfile from "../src/Pages/Edit/EditProfile";
import DashboardLayout from "../src/Layouts/Dashboard/DashboardLayout";
import SideerBar from "../src/Layouts/Dashboard/SideerBar";
import DonorDashboardHome from "../src/Layouts/Dashboard/DonarDashboard/DonorDashboardHome/DonorDashboardHome";
import CreateDonationRequest from "../src/Layouts/Dashboard/DonarDashboard/CreateDonationRequest/CreateDonationRequest";
import Mydonationrequests from "../src/Layouts/Dashboard/DonarDashboard/Donationrequests/Mydonationrequests";



export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      errorElement: <h2>Error Page</h2>,
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },
        {
          path: "/p",
          element: <CkR></CkR>
        
        },
      
     
      ],
    },
    {
      path: "login",
      element: <Login></Login>,
    },
    {
      path: "register",
      element: <Register></Register>,
    }
    ,
    {
       path: "dashboard",
      element: <DashboardLayout></DashboardLayout>,
      errorElement: <h2>Error Page</h2>,
      children: [
         
        {
          index: true,
          element: <DonorDashboardHome></DonorDashboardHome>,
        },
        {
          path: "create-donation-request",
          element: <PrivateRoute><CreateDonationRequest></CreateDonationRequest></PrivateRoute>

        },
        {
          path:"my-donation-requests",
          element: <PrivateRoute><Mydonationrequests></Mydonationrequests></PrivateRoute>
        },
         {
          path: "profile/:email",
          element: <PrivateRoute><EditProfile></EditProfile></PrivateRoute>
        },
        {
          path: "b",
          element: <h2>Hi i am shuvo</h2>,
        
        },
        {
          path: "p",
          element: <PrivateRoute><h2>Hi i am</h2></PrivateRoute>
        }
      ],
    }
  ]);