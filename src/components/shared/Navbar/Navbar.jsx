import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import Logo from "../../../components/shared/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/",                label: "Home",           end: true },
  { to: "/available-camps", label: "Available Camps"           },
  { to: "/about",           label: "About"                     },
];

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        setMenuOpen(false);
        setDropdownOpen(false);
      })
      .catch((err) => console.error(err.message));
  };

  const avatarInitial = (
    user?.displayName?.[0] || user?.email?.[0] || "U"
  ).toUpperCase();

  return (
    <>
      {/* ── wrapper — same as original ── */}
      <div className="navbar-wrap">

        {/* ── pill ── */}
        <div className={`navbar-pill ${scrolled ? "navbar-pill--scrolled" : ""}`}>

          {/* start — logo */}
          <div className="navbar-start">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Logo size="sm" />
            </Link>
          </div>

          {/* center — desktop links */}
          <div className="navbar-center">
            <ul className="navbar-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? "navbar-link--active" : ""}`
                    }
                  >
                    <span>{item.label}</span>
                    <span className="navbar-link-bar" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* end — actions */}
          <div className="navbar-end">

            {/* desktop */}
            <div className="navbar-desktop-actions">
              {user ? (
                <div className="navbar-avatar-wrap" ref={dropdownRef}>
                  <button
                    className="navbar-avatar"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.photoURL
                      ? <img src={user.photoURL} alt={user.displayName} />
                      : avatarInitial
                    }
                  </button>

                  <div className={`navbar-dropdown ${dropdownOpen ? "navbar-dropdown--open" : ""}`}>
                    <div className="navbar-dropdown-info">
                      <span className="navbar-dropdown-name">
                        {user.displayName || "User"}
                      </span>
                      <span className="navbar-dropdown-email">
                        {user.email}
                      </span>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button
                      className="navbar-dropdown-item navbar-dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/register" className="navbar-join-btn">
                  Join Us
                </Link>
              )}
            </div>

            {/* hamburger */}
            <button
              className={`navbar-hamburger ${menuOpen ? "navbar-hamburger--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`navbar-bar ${menuOpen ? "navbar-bar--top" : ""}`} />
              <span className={`navbar-bar ${menuOpen ? "navbar-bar--mid" : ""}`} />
              <span className={`navbar-bar ${menuOpen ? "navbar-bar--bot" : ""}`} />
            </button>

          </div>
        </div>

        {/* ── mobile menu ── */}
        <div className={`navbar-mobile ${menuOpen ? "navbar-mobile--open" : ""}`}>
          <ul className="navbar-mobile-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `navbar-mobile-link ${isActive ? "navbar-mobile-link--active" : ""}`
                  }
                >
                  <span className="navbar-mobile-dot" />
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="navbar-mobile-cta">
              {user ? (
                <>
                  <span className="navbar-mobile-username">
                    {user.displayName || user.email}
                  </span>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="navbar-mobile-btn"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="navbar-mobile-btn navbar-mobile-btn--logout"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="navbar-mobile-btn"
                >
                  Join Us
                </Link>
              )}
            </li>
          </ul>
        </div>

      </div>

      {/* backdrop */}
      {menuOpen && (
        <div
          className="navbar-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;