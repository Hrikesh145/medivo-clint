import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./StatsSection.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Animated count-up hook
const useCountUp = (target, duration = 1800, started = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started || target === 0) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target, started, duration]);
  return val;
};

const Stat = ({ icon, value, suffix = "", label, sub, delay, started }) => {
  const animated = useCountUp(value, 1800, started);
  return (
    <div className="ss__stat" style={{ animationDelay: `${delay}s` }}>
      <div className="ss__stat-icon">{icon}</div>
      <div className="ss__stat-body">
        <div className="ss__stat-value">
          {animated.toLocaleString()}
          <span className="ss__stat-suffix">{suffix}</span>
        </div>
        <div className="ss__stat-label">{label}</div>
        {sub && <div className="ss__stat-sub">{sub}</div>}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  const { data: camps = [] } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const res = await axios.get(`${API}/camps`);
      return res.data;
    },
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const res = await axios.get(`${API}/feedback`);
      return res.data;
    },
  });

  // trigger count-up when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const totalCamps        = camps.length;
  const totalParticipants = camps.reduce((s, c) => s + (c.participantCount || 0), 0);
  const freeCamps         = camps.filter((c) => !c.fees || c.fees === 0).length;
  const avgRating         = feedback.length
    ? Number((feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1))
    : 0;

  const stats = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      value: totalCamps,
      label: "Medical Camps",
      sub:   "Across Bangladesh",
      delay: 0,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      value: totalParticipants,
      suffix: "+",
      label: "Participants Served",
      sub:   "Lives impacted",
      delay: 0.1,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      value: freeCamps,
      label: "Free Camps",
      sub:   "No cost to attend",
      delay: 0.2,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      value: avgRating * 10,   // store as int, display as x.x
      suffix: "/5",
      label: "Average Rating",
      sub:   `From ${feedback.length} reviews`,
      delay: 0.3,
      isRating: true,
      rawVal: avgRating,
    },
  ];

  return (
    <section className="ss" ref={sectionRef}>
      <div className="ss__bg-glow ss__bg-glow--c" />

      {/* diagonal divider top */}
      <div className="ss__divider ss__divider--top" />

      <div className="ss__inner">

        <div className="ss__header">
          <div className="ss__tag">
            <span className="ss__tag-line" />
            <span className="ss__tag-text">Impact</span>
            <span className="ss__tag-line ss__tag-line--r" />
          </div>
          <h2 className="ss__title">Our Impact <em>in Numbers</em></h2>
          <p className="ss__sub">Every number is a life — and every life matters.</p>
        </div>

        <div className="ss__grid">
          {stats.map((s, i) =>
            s.isRating ? (
              <div
                key={i}
                className="ss__stat"
                style={{ animationDelay: `${s.delay}s` }}
              >
                <div className="ss__stat-icon">{s.icon}</div>
                <div className="ss__stat-body">
                  <div className="ss__stat-value">
                    {started ? s.rawVal : "0"}
                    <span className="ss__stat-suffix">{s.suffix}</span>
                  </div>
                  <div className="ss__stat-label">{s.label}</div>
                  <div className="ss__stat-sub">{s.sub}</div>
                </div>
              </div>
            ) : (
              <Stat key={i} {...s} started={started} />
            )
          )}
        </div>

        {/* feature strip */}
        <div className="ss__strip">
          {[
            { icon: "⚕️", text: "Certified Healthcare Professionals" },
            { icon: "🔒", text: "Secure & Private Registration" },
            { icon: "📍", text: "Nationwide Coverage" },
            { icon: "💊", text: "Free Medication at Select Camps" },
          ].map((f, i) => (
            <div key={i} className="ss__feature">
              <span className="ss__feature-icon">{f.icon}</span>
              <span className="ss__feature-text">{f.text}</span>
            </div>
          ))}
        </div>

      </div>

      <div className="ss__divider ss__divider--bottom" />
    </section>
  );
};

export default StatsSection;