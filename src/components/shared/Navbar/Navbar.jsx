import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import Logo from "../../../components/shared/Logo/Logo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinkClass = ({ isActive }) =>
    `font-geologica uppercase tracking-[2px] text-[11px] transition-colors duration-200 
    ${isActive ? "text-white" : "text-white/40 hover:text-white/80"}`;

  const navItems = (
    <>
      <li>
        <NavLink end to="/" className={navLinkClass}>
          {({ isActive }) => (
            <span className="flex flex-col items-center gap-[4px]">
              <span>Home</span>
              <span
                className="h-[1px] w-full rounded-full transition-all duration-300"
                style={
                  isActive
                    ? { background: "#22AACC", boxShadow: "0 0 8px rgba(34,170,204,0.8)" }
                    : { background: "transparent" }
                }
              />
            </span>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink to="/available-camps" className={navLinkClass}>
          {({ isActive }) => (
            <span className="flex flex-col items-center gap-[4px]">
              <span>Available Camps</span>
              <span
                className="h-[1px] w-full rounded-full transition-all duration-300"
                style={
                  isActive
                    ? { background: "#22AACC", boxShadow: "0 0 8px rgba(34,170,204,0.8)" }
                    : { background: "transparent" }
                }
              />
            </span>
          )}
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navLinkClass}>
          {({ isActive }) => (
            <span className="flex flex-col items-center gap-[4px]">
              <span>About</span>
              <span
                className="h-[1px] w-full rounded-full transition-all duration-300"
                style={
                  isActive
                    ? { background: "#22AACC", boxShadow: "0 0 8px rgba(34,170,204,0.8)" }
                    : { background: "transparent" }
                }
              />
            </span>
          )}
        </NavLink>
      </li>
    </>
  );

  // mobile navItems — simpler style
  const mobileNavItems = (
    <>
      {[
        { to: "/", label: "Home", end: true },
        { to: "/available-camps", label: "Available Camps" },
        { to: "/about", label: "About" },
      ].map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 font-geologica text-[11px] uppercase
               tracking-[2px] border-b transition-colors duration-200
               ${isActive
                  ? "text-[#5EC8E0] border-white/10"
                  : "text-white/40 hover:text-white/70 border-white/5"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="w-1 h-1 rounded-full shrink-0 transition-all duration-200"
                  style={
                    isActive
                      ? { background: "#22AACC", boxShadow: "0 0 6px rgba(34,170,204,0.8)" }
                      : { background: "rgba(240,244,255,0.2)" }
                  }
                />
                {item.label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <>
      {/* ════════════════════════
          NAVBAR
      ════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
        <div
          className="membrane-top flex items-center
                     h-[56px] sm:h-[60px] lg:h-[64px]
                     rounded-xl sm:rounded-[14px]
                     transition-all duration-300"
          style={{
            background: "rgba(6, 8, 16, 0.88)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(240,244,255,0.10)",
            boxShadow: scrolled
              ? "0 16px 48px rgba(3,4,7,0.7), 0 4px 12px rgba(3,4,7,0.5)"
              : "0 8px 32px rgba(3,4,7,0.50), 0 2px 8px rgba(3,4,7,0.30)",
          }}
        >

          {/* ── navbar-start — Logo ── */}
          <div className="flex-1 flex items-center px-4 sm:px-6 lg:px-8">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Logo size="sm" />
            </Link>
          </div>

          {/* ── navbar-center — Desktop Links ── */}
          <div className="hidden lg:flex flex-none">
            <ul className="flex items-center gap-8 xl:gap-10">
              {navItems}
            </ul>
          </div>

          {/* ── navbar-end — Actions ── */}
          <div className="flex-1 flex items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="font-geologica uppercase tracking-[2px] text-[10px]
                           px-5 py-2 rounded-full transition-all duration-200"
                style={{
                  color: "#5EC8E0",
                  border: "1px solid rgba(22,136,160,0.35)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(22,136,160,0.12)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(22,136,160,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Join Us
              </Link>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center
                           text-[13px] font-semibold text-white cursor-pointer shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0E5060, #1688A0)",
                  border: "1px solid rgba(34,170,204,0.35)",
                  boxShadow: "0 0 20px rgba(22,136,160,0.3)",
                }}
              >
                A
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col justify-center gap-[5px]
                         w-9 h-9 p-2 rounded-lg transition-all duration-200"
              style={{
                background: menuOpen ? "rgba(22,136,160,0.12)" : "transparent",
                border: menuOpen
                  ? "1px solid rgba(22,136,160,0.25)"
                  : "1px solid transparent",
              }}
              aria-label="Toggle menu"
            >
              <span
                className="block h-[1px] w-full transition-all duration-300 origin-center"
                style={{
                  background: menuOpen ? "#22AACC" : "rgba(240,244,255,0.6)",
                  boxShadow: menuOpen ? "0 0 6px rgba(34,170,204,0.6)" : "none",
                  transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
                }}
              />
              <span
                className="block h-[1px] w-full transition-all duration-300"
                style={{
                  background: "rgba(240,244,255,0.6)",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block h-[1px] w-full transition-all duration-300 origin-center"
                style={{
                  background: "rgba(240,244,255,0.6)",
                  transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
                }}
              />
            </button>

          </div>
        </div>

        {/* ── Mobile Dropdown ── */}
        <div
          className={`lg:hidden mx-1 rounded-b-xl overflow-hidden
                      transition-all duration-300 ease-in-out
                      ${menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
          style={{
            background: "rgba(6,8,16,0.97)",
            backdropFilter: "blur(40px)",
            borderLeft: "1px solid rgba(240,244,255,0.08)",
            borderRight: "1px solid rgba(240,244,255,0.08)",
            borderBottom: "1px solid rgba(240,244,255,0.08)",
          }}
        >
          <ul className="flex flex-col px-5 pt-2 pb-4 gap-1">
            {mobileNavItems}
            {/* mobile CTA */}
            <li className="pt-4 flex items-center gap-3">
              <Link
                to="/join-us"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center font-geologica text-[10px]
                           uppercase tracking-[2px] py-[10px] rounded-full
                           transition-all duration-200"
                style={{
                  color: "#5EC8E0",
                  border: "1px solid rgba(22,136,160,0.35)",
                }}
              >
                Join Us
              </Link>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center
                           text-[13px] font-semibold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0E5060, #1688A0)",
                  border: "1px solid rgba(34,170,204,0.35)",
                  boxShadow: "0 0 20px rgba(22,136,160,0.3)",
                }}
              >
                A
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(3,4,7,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;