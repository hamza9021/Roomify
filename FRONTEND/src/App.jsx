import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
    Home,
    Register,
    Login,
    Logout,
    UpdateUser,
    CreateListing,
    ListingDetail,
    Messages,
    MyListing,
    UpdateListing,
    MyTrip
} from "./Components";
import { Toaster } from "react-hot-toast";

// bruh where is Protect Route
// do this yourself. 
// use zustand light weight for your usecase now  for state management

// EXAMPLE----------

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <ProtectedLayout />, // Wraps all protected routes
//     children: [
//       // Public routes
//       { path: "login", element: <Login /> },
//       { path: "signup", element: <SignUp /> },
      
//       // Protected but role-neutral
//       { index: true, element: <Home /> },
      
//       // Student-only routes
//       {
//         element: <RoleBasedRoute allowedRoles={['student']} />,
//         children: [
//           { path: "courses", element: <Courses /> }
//         ]
//       },
      
//       // Admin-only routes
//       {
//         element: <RoleBasedRoute allowedRoles={['admin']} />,
//         children: [
//           { path: "dashboard", element: <AdminDashboard /> }
//         ]
//       },
      
//       // Fallbacks
//       { path: "unauthorized", element: <Unauthorized /> },
//       { path: "*", element: <Navigate to="/" replace /> }
//     ]
//   }
// ])


// PROTECT ROUTE LOOKSLIEK 

// export default function ProtectedLayout() {
//   const { user, loading } = useAuthContext() // create a auth context wrap react roter wiht it 
  
//   if (loading) return <div>Loading...</div>
//   if (!user) return <Navigate to="/login" replace /> //? you cant acess routes until logged in
  
//   return <Outlet /> // ? you can access routes limited by auth
// }


const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "/u/update",
        element: <UpdateUser />,
    },
    {
        path: "/create/listing",
        element: <CreateListing />,
    },
    {
        path: "/listing/:id",
        element: <ListingDetail />,
    },
    {
        path: "/messages",
        element: <Messages />,
    },
    {
        path: "/host/listings",
        element: <MyListing />,
    },
    {
        path: "/update-listing/:id",
        element: <UpdateListing />,
    },
    {
        path: "/search",
        element: <Home />,
    }
]);

export default function App() {
    return (
        <>
            <Toaster position="bottom-right" reverseOrder={false} />{" "}
            <RouterProvider router={appRouter} />
        </>
    );
}
