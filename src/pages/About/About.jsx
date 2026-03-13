import React from "react";
import { Link } from "react-router";
import "./About.css";

const TEAM = [
  {
    name:  "Dr. Amina Chowdhury",
    role:  "Chief Medical Advisor",
    init:  "AC",
    bio:   "15 years of community healthcare. Specialises in rural outreach.",
  },
  {
    name:  "Rafiul Hasan",
    role:  "Platform Director",
    init:  "RH",
    bio:   "Built camp coordination systems across 6 districts.",
  },
  {
    name:  "Nusrat Jahan",
    role:  "Volunteer Coordinator",
    init:  "NJ",
    bio:   "Manages 200+ trained healthcare volunteers nationwide.",
  },
  {
    name:  "Tanvir Ahmed",
    role:  "Operations Lead",
    init:  "TA",
    bio:   "Ensures every camp runs on time and within compliance.",
  },
];

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: "People First",
    desc:  "Every decision starts with one question — how does this help the patient?",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Radical Access",
    desc:  "Quality healthcare should never be gated by geography or income.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Trusted Care",
    desc:  "Certified professionals, verified camps, transparent operations.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Continuous Impact",
    desc:  "We measure success by outcomes — not attendance numbers.",
  },
];

const About = () => {
  return (
    <div className="ab">

      {/* ── Hero */}
      <section className="ab__hero">
        <div className="ab__hero-glow ab__hero-glow--tl" />
        <div className="ab__hero-glow ab__hero-glow--br" />
        <div className="ab__hero-grid" />

        <div className="ab__hero-inner">
          <div className="ab__tag">
            <span className="ab__tag-line" />
            <span className="ab__tag-text">About Medivo</span>
          </div>
          <h1 className="ab__hero-title">
            Healthcare
            <br />
            <em>Without Barriers</em>
          </h1>
          <p className="ab__hero-desc">
            Medivo is Bangladesh's dedicated platform connecting community medical
            camps with the people who need them most. We believe that access to
            quality healthcare is a right — not a privilege.
          </p>
          <div className="ab__hero-btns">
            <Link to="/available-camps" className="ab__btn ab__btn--primary">
              Find a Camp
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* floating stat chips */}
        <div className="ab__chips">
          <div className="ab__chip">
            <span className="ab__chip-num">50+</span>
            <span className="ab__chip-lbl">Camps</span>
          </div>
          <div className="ab__chip ab__chip--offset">
            <span className="ab__chip-num">10k+</span>
            <span className="ab__chip-lbl">Patients</span>
          </div>
          <div className="ab__chip">
            <span className="ab__chip-num">64</span>
            <span className="ab__chip-lbl">Districts</span>
          </div>
        </div>
      </section>

      {/* ── Mission */}
      <section className="ab__mission">
        <div className="ab__mission-inner">
          <div className="ab__mission-text">
            <div className="ab__tag">
              <span className="ab__tag-line" />
              <span className="ab__tag-text">Our Mission</span>
            </div>
            <h2 className="ab__section-title">
              Bridging the gap between
              <em> communities and care</em>
            </h2>
            <p className="ab__body-text">
              In Bangladesh, millions live far from reliable medical facilities.
              Medivo exists to close that gap — by making it effortless for
              healthcare organisations to run camps and for individuals to find
              and attend them.
            </p>
            <p className="ab__body-text">
              From urban screening clinics to remote vaccination drives, every
              camp on our platform is verified, staffed by certified professionals,
              and open to all.
            </p>
          </div>

          <div className="ab__mission-visual">
            <div className="ab__visual-card ab__visual-card--1">
              <div className="ab__visual-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22AACC" strokeWidth="1.3">
                  <rect x="7.5" y="1" width="3" height="16" rx="1.5"/>
                  <rect x="1" y="7.5" width="16" height="3" rx="1.5"/>
                </svg>
              </div>
              <div className="ab__visual-card-title">Medical Camps</div>
              <div className="ab__visual-card-sub">Screening · Vaccination · Consultation</div>
            </div>
            <div className="ab__visual-card ab__visual-card--2">
              <div className="ab__visual-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22AACC" strokeWidth="1.3">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="ab__visual-card-title">Community Reach</div>
              <div className="ab__visual-card-sub">Urban · Peri-urban · Rural</div>
            </div>
            <div className="ab__visual-card ab__visual-card--3">
              <div className="ab__visual-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22AACC" strokeWidth="1.3">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div className="ab__visual-card-title">Live Tracking</div>
              <div className="ab__visual-card-sub">Real-time registration & analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values */}
      <section className="ab__values">
        <div className="ab__values-inner">
          <div className="ab__tag ab__tag--center">
            <span className="ab__tag-line" />
            <span className="ab__tag-text">Our Values</span>
            <span className="ab__tag-line ab__tag-line--r" />
          </div>
          <h2 className="ab__section-title ab__section-title--center">
            What drives <em>every decision</em>
          </h2>

          <div className="ab__values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="ab__value-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="ab__value-icon">{v.icon}</div>
                <div className="ab__value-title">{v.title}</div>
                <div className="ab__value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team */}
      <section className="ab__team">
        <div className="ab__team-inner">
          <div className="ab__tag ab__tag--center">
            <span className="ab__tag-line" />
            <span className="ab__tag-text">The Team</span>
            <span className="ab__tag-line ab__tag-line--r" />
          </div>
          <h2 className="ab__section-title ab__section-title--center">
            People behind <em>the platform</em>
          </h2>

          <div className="ab__team-grid">
            {TEAM.map((m, i) => (
              <div key={i} className="ab__member" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="ab__member-avatar">{m.init}</div>
                <div className="ab__member-name">{m.name}</div>
                <div className="ab__member-role">{m.role}</div>
                <p className="ab__member-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA */}
      <section className="ab__cta">
        <div className="ab__cta-glow" />
        <div className="ab__cta-inner">
          <h2 className="ab__cta-title">Ready to make an impact?</h2>
          <p className="ab__cta-sub">
            Join thousands of participants and organisers already on Medivo.
          </p>
          <div className="ab__cta-btns">
            <Link to="/available-camps" className="ab__btn ab__btn--primary">
              Browse Camps
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;