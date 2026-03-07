import React from "react";
import { Outlet } from "react-router";
import "../style/AuthLayout.css";
import Logo from "../components/shared/Logo/Logo";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* top membrane line */}
      <div className="auth-layout__membrane" />

      {/* ════════════════ LEFT PANEL ════════════════ */}
      <div className="auth-left">
        <div className="auth-left__bg" />
        <div className="auth-left__overlay" />
        <div className="auth-left__scanlines" />
        <div className="auth-left__grid" />
        <div className="auth-left__edge-fade" />
        <div className="auth-left__edge-line" />
        <div className="auth-left__quote-mark">"</div>

        {/* logo */}
        <div className="auth-left__logo">
          <Logo size="lg" />
        </div>

        {/* quote */}
        <div className="auth-left__quote-wrap">
          <div className="auth-left__quote-tag">
            <span className="auth-left__quote-tag-line" />
            <span className="auth-left__quote-tag-text">Our Mission</span>
          </div>

          <blockquote className="auth-left__blockquote">
            "Healthcare is not
            <br />
            a privilege —<br />
            <br />
            it is a <span className="highlight">right</span>
            <br />
            for every soul."
          </blockquote>

          <div className="auth-left__author">
            <span className="auth-left__author-line" />
            <span className="auth-left__author-text">Medivo, 2025</span>
          </div>
        </div>

        {/* trust badges */}
        <div className="auth-left__badges">
          {[
            { val: "10K+", lbl: "Participants" },
            { val: "250+", lbl: "Camps Held" },
            { val: "4.9★", lbl: "Avg Rating" },
          ].map((b) => (
            <div key={b.lbl} className="auth-left__badge">
              <span className="auth-left__badge-val">{b.val}</span>
              <span className="auth-left__badge-lbl">{b.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════ RIGHT PANEL ════════════════ */}
      <div className="auth-right">
        <div className="auth-right__glow-top" />
        <div className="auth-right__glow-bottom" />
        <div className="auth-right__scanlines" />
        <div className="auth-right__mobile-bg" />
        <div className="auth-right__mobile-overlay" />

        <div className="auth-right__inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
