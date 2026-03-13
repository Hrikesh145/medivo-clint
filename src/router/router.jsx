import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Registration from "../pages/Authentication/Registration/Registration";
import DashboardLayout from "../layouts/DashboardLayout";
import AddCamp from "../pages/DashboardOrganizer/AddCamp/AddCamp";
import ManageCamp from "../pages/DashboardOrganizer/ManageCamp/ManageCamp";
import UpdateCamp from "../pages/DashboardOrganizer/UpdateCamp/UpdateCamp";
import PrivateRoute from "../routers/privateRoute";
import AvailableCamps from "../pages/AvailableCamps/AvailableCamps";
import Analytics from "../pages/DashboardParticipant/Analytics/Analytics";
import RegisteredCamps from "../pages/DashboardParticipant/RegisteredCamps/RegisteredCamps";
import PaymentHistory from "../pages/DashboardParticipant/PaymentHistory/PaymentHistory";
import Profile from "../pages/DashboardShard/Profile/Profile";
import OrganizerRoute from "../routers/OrganizerRoute";
import ParticipantRoute from "../routers/ParticipantRoute";
import Payment from "../pages/Payment/Payment ";
import ManageRegistered from "../pages/DashboardOrganizer/ManageRegistered/ManageRegistered";
import About from "../pages/About/About";
import NotFound from "../pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "available-camps",
        element: (
          <PrivateRoute>
            <AvailableCamps />
          </PrivateRoute>
        ),
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "*",
        Component: NotFound,
      }
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Registration },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ── organizer only
      {
        path: "add-camp",
        element: (
          <OrganizerRoute>
            <AddCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-camps",
        element: (
          <OrganizerRoute>
            <ManageCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: "update-camp/:id",
        element: (
          <OrganizerRoute>
            <UpdateCamp />
          </OrganizerRoute>
        ),
      },
      {
        path: "manage-registered",
        element: (
          <OrganizerRoute>
            <ManageRegistered />
          </OrganizerRoute>
        ),
      },

      // ── participant only
      {
        path: "analytics",
        element: (
          <ParticipantRoute>
            <Analytics />
          </ParticipantRoute>
        ),
      },
      {
        path: "registered-camps",
        element: (
          <ParticipantRoute>
            <RegisteredCamps />
          </ParticipantRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <ParticipantRoute>
            <PaymentHistory />
          </ParticipantRoute>
        ),
      },
      {
        path: "payment/:registrationId",
        element: (
          <ParticipantRoute>
            <Payment />
          </ParticipantRoute>
        ),
      },

      // ── shared
      {
        path: "profile",
        Component: Profile,
      },
    ],
  },
]);
