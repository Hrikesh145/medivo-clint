import React from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import "../style/DashboardLayout.css";

const ORGANIZER_LINKS = [
  { to: "/dashboard/profile",           label: "Profile"           },
  { to: "/dashboard/add-camp",          label: "Add Camp"          },
  { to: "/dashboard/manage-camps",      label: "Manage Camps"      },
  { to: "/dashboard/manage-registered", label: "Manage Registered" },
];

const PARTICIPANT_LINKS = [
  { to: "/dashboard/analytics",        label: "Analytics"        },
  { to: "/dashboard/profile",          label: "Profile"          },
  { to: "/dashboard/registered-camps", label: "Registered Camps" },
  { to: "/dashboard/payment-history",  label: "Payment History"  },
];

const getPageTitle = (pathname) => {
  if (pathname.includes("/dashboard/add-camp"))          return "Add Camp";
  if (pathname.includes("/dashboard/manage-camps"))      return "Manage Camps";
  if (pathname.includes("/dashboard/manage-registered")) return "Manage Registered";
  if (pathname.includes("/dashboard/analytics"))         return "Analytics";
  if (pathname.includes("/dashboard/registered-camps"))  return "Registered Camps";
  if (pathname.includes("/dashboard/payment-history"))   return "Payment History";
  if (pathname.includes("/dashboard/profile"))           return "Profile";
  if (pathname.includes("/dashboard/update-camp"))       return "Update Camp";
  return "Dashboard";
};

const DashboardLayout = () => {
  const { user, logoutUser } = useAuth();
  const { role: userRole, roleLoading } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const links      = userRole === "organizer" ? ORGANIZER_LINKS  : PARTICIPANT_LINKS;
  const roleLabel  = userRole === "organizer" ? "Organizer"      : "Participant";
  const panelLabel = userRole === "organizer" ? "Organizer Panel" : "Participant Panel";
  const pageTitle  = getPageTitle(location.pathname);

  const handleLogout = () => {
    logoutUser()
      .then(() => navigate("/"))
      .catch((err) => console.error(err.message));
  };

  const avatarContent = user?.photoURL ? (
    <img src={user.photoURL} alt={user.displayName || "User"} />
  ) : (
    (user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase()
  );

  if (roleLoading) return (
    <div style={{
      minHeight: "100vh", background: "#090C16",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Teko, sans-serif", fontSize: "12px",
      letterSpacing: "5px", textTransform: "uppercase",
      color: "rgba(240,244,255,0.2)"
    }}>
      Loading...
    </div>
  );

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-sidebar__glow" />

        <Link to="/" className="dash-sidebar__logo">
          <div className="dash-sidebar__logo-icon">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="#5EC8E0" />
              <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="#5EC8E0" />
            </svg>
          </div>
          <span className="dash-sidebar__logo-text">MEDI<em>VO</em></span>
        </Link>

        <div className="dash-sidebar__user">
          <div className="dash-sidebar__avatar">{avatarContent}</div>
          <div className="dash-sidebar__user-meta">
            <div className="dash-sidebar__user-name">
              {user?.displayName || user?.email || "User"}
            </div>
            <div className="dash-sidebar__user-role">{roleLabel}</div>
          </div>
        </div>

        <nav className="dash-sidebar__nav">
          <span className="dash-sidebar__section-label">{panelLabel}</span>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `dash-sidebar__link ${isActive ? "dash-sidebar__link--active" : ""}`
              }
            >
              <span className="dash-sidebar__dot" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
          <button className="dash-sidebar__logout" onClick={handleLogout}>
            <span className="dash-sidebar__logout-dot" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar__left">
            <span className="dash-topbar__label">Dashboard</span>
            <h1 className="dash-topbar__page">{pageTitle}</h1>
          </div>
          <Link to="/" className="dash-topbar__home">Home</Link>
        </header>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;