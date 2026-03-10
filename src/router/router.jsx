import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import { Component } from "react";
import Login from "../pages/Authentication/Login/Login";
import Registration from "../pages/Authentication/Registration/Registration";
import DashboardLayout from "../layouts/DashboardLayout";
import AddCamp from "../pages/DashboardOrganizer/AddCamp/AddCamp";
import ManageCamp from "../pages/DashboardOrganizer/ManageCamp/ManageCamp";
import updateCamp from "../pages/DashboardOrganizer/updateCamp/updateCamp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Registration,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        path: "add-camp",
        Component: AddCamp,
      },
      {
        path: "manage-camps",
        Component: ManageCamp,
      },
      {
        path: "update-camp/:id", 
        Component: updateCamp,
      },
    ],
  },
]);
