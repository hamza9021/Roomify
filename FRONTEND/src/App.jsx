import React from "react";
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import { Home, Register } from "./Components";

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/register",
    element:<Register/>
  }
])

export default function App() {
  return (
    <RouterProvider router={appRouter}/>
  );
}