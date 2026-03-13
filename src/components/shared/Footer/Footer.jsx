import React from "react";
import { Link } from "react-router";
import Logo from "../Logo/Logo";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const Footer = () => {
  const contactItems = [
    { icon: "📧", text: "support@medivo.health" },
    { icon: "📞", text: "+880 1700-000000" },
    { icon: "📍", text: "Dhaka, Bangladesh" },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Available Camps", to: "/available-camps" },
    { label: "About Us", to: "/about" },

  ];

  const legalLinks = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Use", to: "/terms" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer
      className="relative w-full mt-20 overflow-hidden rounded-t-2xl sm:rounded-t-3xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(7,10,18,0.96) 0%, rgba(4,6,12,1) 100%)",
        borderTop: "1px solid rgba(240,244,255,0.06)",
      }}
    >
      {/* top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,#1688A0 20%,#22AACC 50%,#1688A0 80%,transparent 100%)",
          boxShadow: "0 0 20px rgba(22,136,160,0.35)",
        }}
      />

      {/* ambient glows */}
      <div
        className="absolute -top-10 -left-10 w-[420px] h-[260px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,136,160,0.14), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[360px] h-[220px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,170,204,0.10), transparent 70%)",
        }}
      />

      {/* soft grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-14 pb-6">
        {/* main section */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 pb-12"
          style={{ borderBottom: "1px solid rgba(240,244,255,0.06)" }}
        >
          {/* brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="w-fit">
              <Logo size="md" />
            </Link>

            <p
              className="font-geologica font-light leading-relaxed max-w-sm"
              style={{ fontSize: "13px", color: "rgba(240,244,255,0.40)" }}
            >
              Medivo is a modern medical camp management platform connecting
              communities with trusted healthcare services through organized,
              accessible, and impactful care experiences.
            </p>

            <div className="flex gap-3 pt-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "rgba(240,244,255,0.04)",
                    border: "1px solid rgba(240,244,255,0.08)",
                    color: "rgba(240,244,255,0.42)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(22,136,160,0.14)";
                    e.currentTarget.style.borderColor =
                      "rgba(34,170,204,0.30)";
                    e.currentTarget.style.color = "#5EC8E0";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 0 18px rgba(22,136,160,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(240,244,255,0.04)";
                    e.currentTarget.style.borderColor =
                      "rgba(240,244,255,0.08)";
                    e.currentTarget.style.color = "rgba(240,244,255,0.42)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span
                className="w-6 h-px"
                style={{
                  background: "linear-gradient(90deg,#22AACC,transparent)",
                }}
              />
              <span
                className="font-teko text-[13px] tracking-[4px] uppercase"
                style={{ color: "#22AACC" }}
              >
                Quick Links
              </span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-geologica font-light transition-colors duration-200 flex items-center gap-2 group"
                    style={{
                      fontSize: "13px",
                      color: "rgba(240,244,255,0.38)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "rgba(240,244,255,0.82)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(240,244,255,0.38)";
                    }}
                  >
                    <span
                      className="text-[10px] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ color: "#22AACC" }}
                    >
                      →
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span
                className="w-6 h-px"
                style={{
                  background: "linear-gradient(90deg,#22AACC,transparent)",
                }}
              />
              <span
                className="font-teko text-[13px] tracking-[4px] uppercase"
                style={{ color: "#22AACC" }}
              >
                Contact
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {contactItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 font-geologica font-light"
                  style={{ fontSize: "13px", color: "rgba(240,244,255,0.34)" }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(22,136,160,0.10)",
                      border: "1px solid rgba(34,170,204,0.14)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 mt-1"
              style={{
                background: "rgba(240,244,255,0.03)",
                border: "1px solid rgba(240,244,255,0.06)",
              }}
            >
              <p
                className="font-teko uppercase tracking-[3px] mb-2"
                style={{ fontSize: "12px", color: "rgba(240,244,255,0.72)" }}
              >
                Care With Access
              </p>
              <p
                className="font-geologica font-light leading-relaxed"
                style={{ fontSize: "12px", color: "rgba(240,244,255,0.28)" }}
              >
                Helping patients discover nearby medical camps and giving
                organizers the tools to manage healthcare outreach smoothly.
              </p>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-geologica font-light text-center md:text-left"
            style={{ fontSize: "11px", color: "rgba(240,244,255,0.20)" }}
          >
            © {new Date().getFullYear()} Medivo. All rights reserved.
          </p>

          <div className="flex items-center gap-5 flex-wrap justify-center">
            {legalLinks.map((item, i) => (
              <React.Fragment key={item.label}>
                <Link
                  to={item.to}
                  className="font-geologica font-light transition-colors duration-200"
                  style={{ fontSize: "11px", color: "rgba(240,244,255,0.24)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(240,244,255,0.60)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240,244,255,0.24)";
                  }}
                >
                  {item.label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span
                    style={{
                      color: "rgba(240,244,255,0.10)",
                      fontSize: "10px",
                    }}
                  >
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p
            className="font-geologica font-light text-center md:text-right"
            style={{ fontSize: "11px", color: "rgba(240,244,255,0.15)" }}
          >
            Built with <span style={{ color: "#22AACC" }}>♥</span> using React &
            Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;