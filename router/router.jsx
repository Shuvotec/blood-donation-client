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
import Editdonation from "../src/Layouts/Dashboard/DonarDashboard/Editdonation/Editdonation";
import Donationdetails from "../src/Layouts/Dashboard/DonarDashboard/Donationdetails/Donationdetails";
import Adminhome from "../src/Layouts/Admin/Adminhome/Adminhome";
import Tests from "../src/Shared/Tests";
import AllUser from "../src/Layouts/Admin/AllUser/AllUser";
import MyDonationreq from "../src/Layouts/Admin/MyDonationreq/MyDonationreq";
import Contentmana from "../src/Layouts/Admin/Contentmana/Contentmana";
import Createblog from "../src/Layouts/Admin/Contentmana/Createblog/Createblog";
import Editcontent from "../src/Layouts/Admin/Contentmana/Editcontent/Editcontent";



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
        path: "my-donation-requests",
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
        path: "edit-donation-request/:id",
        element: <PrivateRoute><Editdonation /></PrivateRoute>,
      },
      {
        path: "donation-details/:id",
        element: <PrivateRoute><Donationdetails></Donationdetails></PrivateRoute>,
      },
      {
        path: "admin",
        element: <PrivateRoute><Adminhome></Adminhome></PrivateRoute>
      },
      {
        path: "userall",
        element: <PrivateRoute><AllUser></AllUser></PrivateRoute>
      },
      {
        path: "all-blood-donation-request",
        element: <PrivateRoute><MyDonationreq></MyDonationreq></PrivateRoute>
      },

      {
        path:"content-management",
        element: <PrivateRoute><Contentmana></Contentmana></PrivateRoute>
      },
      {
        path:"content-management/add-blog",
        element: <PrivateRoute><Createblog></Createblog></PrivateRoute>
      },
      {
        path:"content-management/Edit-blog/:id",
        element: <PrivateRoute><Editcontent></Editcontent></PrivateRoute>
      },

      {
        path: "t",
        element: <PrivateRoute><Tests></Tests></PrivateRoute>
      }
    ],
  }
]);