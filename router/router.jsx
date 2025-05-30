import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../src/Layouts/MainLayout/MainLayout";
import Home from "../src/Pages/Home/Home";
import Login from "../src/Pages/Login/Login/Login";
import Register from "../src/Pages/Login/Register/Register";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./Adminroute";

import EditProfile from "../src/Pages/Edit/EditProfile";
import DashboardLayout from "../src/Layouts/Dashboard/DashboardLayout";
import DonorDashboardHome from "../src/Layouts/Dashboard/DonarDashboard/DonorDashboardHome/DonorDashboardHome";
import CreateDonationRequest from "../src/Layouts/Dashboard/DonarDashboard/CreateDonationRequest/CreateDonationRequest";
import Mydonationrequests from "../src/Layouts/Dashboard/DonarDashboard/Donationrequests/Mydonationrequests";
import Viewallrequest from "../src/Layouts/Dashboard/DonarDashboard/Donationrequests/Alldonation/Viewallrequest";
import Editdonation from "../src/Layouts/Dashboard/DonarDashboard/Editdonation/Editdonation";
import Donationdetails from "../src/Layouts/Dashboard/DonarDashboard/Donationdetails/Donationdetails";
import Allsearch from "../src/Pages/Allsearch/Allsearch";

import Adminhome from "../src/Layouts/Admin/Adminhome/Adminhome";
import AllUser from "../src/Layouts/Admin/AllUser/AllUser";
import MyDonationreq from "../src/Layouts/Admin/MyDonationreq/MyDonationreq";
import Contentmana from "../src/Layouts/Admin/Contentmana/Contentmana";
import Createblog from "../src/Layouts/Admin/Contentmana/Createblog/Createblog";
import Editcontent from "../src/Layouts/Admin/Contentmana/Editcontent/Editcontent";

import Volunteerhome from "../src/Layouts/Volunteer/Volunteerhome/Volunteerhome";

import Tests from "../src/Shared/Tests";
import SearchPage from "../src/Pages/Home/SearchPage/SearchPage";
import Donationreqall from "../src/Pages/Home/Donationreqall/Donationreqall";
import Donationreqdetails
 from "../src/Pages/Home/Donationreqall/Donationreqdetails/Donationreqdetails";
import Blogpublic from "../src/Pages/Home/Blogpublic/Blogpublic";
import Blogdetails from "../src/Pages/Home/Blogpublic/Blogdetails/Blogdetails";
import ErrorPage from "../src/Pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "allsearch/donar",
        element: <SearchPage></SearchPage>,
      },
      {
        path: "donationreq/all",
        element: <Donationreqall></Donationreqall>,
      },
      {
        path: "donationreq/all/:id",
        element: <PrivateRoute><Donationdetails></Donationdetails></PrivateRoute>,
      },
      {
        path: "blog",
        element: <Blogpublic></Blogpublic>,
      },
      {
        path: "blog/:id",
        element: <Blogdetails></Blogdetails>,
      },
      

     
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },

  {
    path: "/block",
    element: <h2>User Block</h2>,
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    errorElement: <h2>Error Page</h2>,
    children: [
      {
        index: true,
        element: <DonorDashboardHome />,
      },
      {
        path: "create-donation-request",
        element: <PrivateRoute><CreateDonationRequest /></PrivateRoute>,
      },
      {
        path: "my-donation-requests",
        element: <PrivateRoute><Mydonationrequests /></PrivateRoute>,
      },
      {
        path: "profile/:email",
        element: <PrivateRoute><EditProfile /></PrivateRoute>,
      },
      {
        path: "my-donationsall",
        element: <PrivateRoute><Viewallrequest /></PrivateRoute>,
      },
      {
        path: "edit-donation-request/:id",
        element: <PrivateRoute><Editdonation /></PrivateRoute>,
      },
      {
        path: "donation-details/:id",
        element: <PrivateRoute><Donationdetails /></PrivateRoute>,
      },

      //Admin Routes
      {
        path: "admin/home",
        element: <Adminhome />,
      },
      {
        path: "userall",
        element: <AllUser />,
      },
      {
        path: "all-blood-donation-request",
        element: <MyDonationreq />,
      },
      {
        path: "content-management",
        element: <Contentmana />,
      },
      {
        path: "content-management/add-blog",
        element: <Createblog />,
      },
      {
        path: "content-management/Edit-blog/:id",
        element: <Editcontent />,
      },

      // Volunteer route
      {
        path: "volunteer",
        element: <PrivateRoute><Volunteerhome /></PrivateRoute>,
      },

      {
        path: "t",
        element: <PrivateRoute><Tests /></PrivateRoute>,
      },
    ],
  },
]);
