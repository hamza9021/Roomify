import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home, Register, Login, Logout, UpdateUser } from "./Components";
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
]);

export default function App() {
    return (
        <>
            <Toaster position="bottom-right" reverseOrder={false} />{" "}
            <RouterProvider router={appRouter} />
        </>
    );
}
