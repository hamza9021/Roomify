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
        path: "trips",
        element: <MyTrip />,
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
