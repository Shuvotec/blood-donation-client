import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../src/Layouts/MainLayout/MainLayout";
import Home from "../src/Pages/Home/Home";
import Login from "../src/Pages/Login/Login/Login";
import Register from "../src/Pages/Login/Register/Register";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "../src/Pages/Edit/EditProfile";
import DashboardLayout from "../src/Layouts/Dashboard/DashboardLayout";
import DonorDashboardHome from "../src/Layouts/Dashboard/DonarDashboard/DonorDashboardHome/DonorDashboardHome";
import CreateDonationRequest from "../src/Layouts/Dashboard/DonarDashboard/CreateDonationRequest/CreateDonationRequest";
import Mydonationrequests from "../src/Layouts/Dashboard/DonarDashboard/Donationrequests/Mydonationrequests";
import Viewallrequest from "../src/Layouts/Dashboard/DonarDashboard/Donationrequests/Alldonation/Viewallrequest";
import Allsearch from "../src/Pages/Allsearch/Allsearch";



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
          path: "allsearch",
          element: <Allsearch></Allsearch>
        
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
          path: "my-donationsall",
          element: <PrivateRoute><Viewallrequest></Viewallrequest></PrivateRoute>,
        
        },
        {
          path: "p",
          element: <PrivateRoute><h2>Hi i am</h2></PrivateRoute>
        }
      ],
    }
  ]);