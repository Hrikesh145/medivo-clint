import React from "react";
import { Link } from "react-router";
import Logo from "../Logo/Logo";

const LINKS = {
  platform: [
    { label: "Available Camps", to: "/available-camps" },
    { label: "Join a Camp", to: "/available-camps" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "About Us", to: "/about" },
  ],
  organizer: [
    { label: "Add New Camp", to: "/dashboard/add-camp" },
    { label: "Manage Camps", to: "/dashboard/manage-camps" },
    { label: "Registered Users", to: "/dashboard/manage-registered-camps" },
    { label: "Organizer Dashboard", to: "/dashboard" },
  ],
  participant: [
    { label: "My Profile", to: "/dashboard/participant-profile" },
    { label: "Registered Camps", to: "/dashboard/registered-camps" },
    { label: "Payment History", to: "/dashboard/payment-history" },
    { label: "Analytics", to: "/dashboard/analytics" },
  ],
};

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

  const bottomLinks = [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Use", to: "/terms" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer
      className="relative w-full mt-20 overflow-hidden rounded-t-2xl sm:rounded-t-3xl"
      style={{
        background: "rgba(5,7,14,0.95)",
        borderTop: "1px solid rgba(240,244,255,0.06)",
      }}
    >
      {/* top membrane line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,#1688A0 20%,#22AACC 50%,#1688A0 80%,transparent 100%)",
          boxShadow: "0 0 20px rgba(22,136,160,0.4)",
        }}
      />

      {/* ambient glow */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse,rgba(14,80,96,0.12),transparent 70%)",
        }}
      />

      {/* scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(240,244,255,0.008) 2px,rgba(240,244,255,0.008) 3px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-14 pb-0">
        {/* top row */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12"
          style={{ borderBottom: "1px solid rgba(240,244,255,0.06)" }}
        >
          {/* brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/">
              <Logo size="md" />
            </Link>

            <p
              className="font-geologica font-light leading-relaxed max-w-xs"
              style={{ fontSize: "13px", color: "rgba(240,244,255,0.38)" }}
            >
              A premium medical camp management system — connecting communities
              with certified physicians through organized, accessible, and
              life-changing healthcare camps.
            </p>

            <div className="flex flex-col gap-3 mt-1">
              {contactItems.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 font-geologica font-light"
                  style={{ fontSize: "12px", color: "rgba(240,244,255,0.30)" }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] shrink-0"
                    style={{
                      background: "rgba(22,136,160,0.10)",
                      border: "1px solid rgba(34,170,204,0.15)",
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(240,244,255,0.04)",
                    border: "1px solid rgba(240,244,255,0.08)",
                    color: "rgba(240,244,255,0.40)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(22,136,160,0.15)";
                    e.currentTarget.style.borderColor =
                      "rgba(34,170,204,0.35)";
                    e.currentTarget.style.color = "#5EC8E0";
                    e.currentTarget.style.boxShadow =
                      "0 0 16px rgba(22,136,160,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(240,244,255,0.04)";
                    e.currentTarget.style.borderColor =
                      "rgba(240,244,255,0.08)";
                    e.currentTarget.style.color = "rgba(240,244,255,0.40)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {[
            { heading: "Platform", links: LINKS.platform },
            { heading: "Organizer", links: LINKS.organizer },
            { heading: "Participant", links: LINKS.participant },
          ].map((col) => (
            <div key={col.heading} className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span
                  className="w-5 h-px"
                  style={{
                    background: "linear-gradient(90deg,#22AACC,transparent)",
                  }}
                />
                <span
                  className="font-teko text-[12px] tracking-[4px] uppercase"
                  style={{ color: "#22AACC" }}
                >
                  {col.heading}
                </span>
              </div>

              <ul className="flex flex-col gap-[10px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-geologica font-light transition-colors duration-200 flex items-center gap-2 group"
                      style={{
                        fontSize: "13px",
                        color: "rgba(240,244,255,0.35)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(240,244,255,0.80)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(240,244,255,0.35)";
                      }}
                    >
                      <span
                        className="text-[10px] transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
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
          ))}
        </div>

        {/* newsletter */}
        <div
          className="py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between"
          style={{ borderBottom: "1px solid rgba(240,244,255,0.06)" }}
        >
          <div>
            <p
              className="font-teko text-[14px] tracking-[3px] uppercase mb-1"
              style={{ color: "rgba(240,244,255,0.70)" }}
            >
              Stay Updated
            </p>
            <p
              className="font-geologica font-light"
              style={{ fontSize: "12px", color: "rgba(240,244,255,0.28)" }}
            >
              Get notified when new camps are available near you.
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 px-4 py-[10px] rounded-full font-geologica font-light text-[12px] outline-none transition-all duration-200"
              style={{
                background: "rgba(240,244,255,0.04)",
                border: "1px solid rgba(240,244,255,0.08)",
                color: "rgba(240,244,255,0.7)",
                fontFamily: "'Geologica', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(34,170,204,0.4)";
                e.target.style.background = "rgba(22,136,160,0.08)";
                e.target.style.boxShadow = "0 0 0 3px rgba(22,136,160,0.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(240,244,255,0.08)";
                e.target.style.background = "rgba(240,244,255,0.04)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              className="px-6 py-[10px] rounded-full font-geologica font-semibold text-[11px] uppercase tracking-[2px] shrink-0 transition-all duration-300 hover:-translate-y-[1px]"
              style={{
                background: "linear-gradient(135deg,#0E5060,#1688A0)",
                border: "1px solid rgba(34,170,204,0.4)",
                color: "rgba(240,244,255,0.95)",
                boxShadow: "0 0 20px rgba(22,136,160,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 36px rgba(22,136,160,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(22,136,160,0.25)";
              }}
            >
              Notify Me
            </button>
          </div>
        </div>

        {/* bottom bar */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-geologica font-light text-center sm:text-left"
            style={{ fontSize: "11px", color: "rgba(240,244,255,0.20)" }}
          >
            © {new Date().getFullYear()} Medivo. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {bottomLinks.map((item, i) => (
              <React.Fragment key={item.label}>
                <Link
                  to={item.to}
                  className="font-geologica font-light transition-colors duration-200"
                  style={{ fontSize: "11px", color: "rgba(240,244,255,0.22)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(240,244,255,0.60)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240,244,255,0.22)";
                  }}
                >
                  {item.label}
                </Link>
                {i < bottomLinks.length - 1 && (
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
            className="font-geologica font-light"
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