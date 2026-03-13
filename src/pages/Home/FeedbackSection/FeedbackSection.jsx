import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "./FeedbackSection.css";

const API = import.meta.env.VITE_API_URL || "https://medivo-server.vercel.app";

const StarRating = ({ rating, size = 13 }) => (
  <div className="fb__stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width={size} height={size}
        viewBox="0 0 24 24"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        className={`fb__star ${i < rating ? "fb__star--on" : "fb__star--off"}`}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const FeedbackSection = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const { data: rawFeedback = [], isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const res = await axios.get(`${API}/feedback`);
      return res.data;
    },
  });

  const feedback = useMemo(
    () => rawFeedback.filter((f) => f.comment?.trim()),
    [rawFeedback]
  );

  const count = feedback.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % count);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [count, paused]);

  const goTo = (idx) => {
    setActive(idx);
    setPaused(true);
    clearInterval(timerRef.current);
    setTimeout(() => setPaused(false), 10000);
  };

  const prev = () => goTo((active - 1 + count) % count);
  const next = () => goTo((active + 1) % count);

  const avgRating = count
    ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / count).toFixed(1)
    : 0;
  const fiveStars  = feedback.filter((f) => f.rating === 5).length;
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    r,
    n:   feedback.filter((f) => f.rating === r).length,
    pct: count
      ? Math.round((feedback.filter((f) => f.rating === r).length / count) * 100)
      : 0,
  }));

  if (isLoading || count === 0) return null;

  const current = feedback[active];

  return (
    <section className="fb">
      <div className="fb__bg-glow fb__bg-glow--l" />
      <div className="fb__bg-glow fb__bg-glow--r" />
      <div className="fb__bg-line fb__bg-line--1" />
      <div className="fb__bg-line fb__bg-line--2" />

      <div className="fb__inner">

        {/* ── header */}
        <div className="fb__header">
          <div className="fb__tag">
            <span className="fb__tag-line" />
            <span className="fb__tag-text">Testimonials</span>
            <span className="fb__tag-line fb__tag-line--r" />
          </div>
          <h2 className="fb__title">
            Participant
            <em> Voices</em>
          </h2>
          <p className="fb__sub">
            Real experiences from people whose lives were touched by our camps.
          </p>
        </div>

        {/* ── two-column layout */}
        <div className="fb__layout">

          {/* LEFT — aggregate rating panel */}
          <div className="fb__stats-panel">
            <div className="fb__big-score">
              <span className="fb__big-num">{avgRating}</span>
              <span className="fb__big-denom">/5</span>
            </div>

            <StarRating rating={Math.round(Number(avgRating))} size={18} />

            <div className="fb__review-count">{count} verified reviews</div>

            <div className="fb__dist">
              {ratingDist.map(({ r, pct }) => (
                <div key={r} className="fb__dist-row">
                  <span className="fb__dist-num">{r}</span>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="#22AACC">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div className="fb__dist-track">
                    <div
                      className="fb__dist-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="fb__dist-pct">{pct}%</span>
                </div>
              ))}
            </div>

            <div className="fb__badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#22AACC">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {fiveStars} five-star ratings
            </div>
          </div>

          {/* RIGHT — carousel */}
          <div className="fb__carousel">

            <div className="fb__card" key={`card-${active}`}>
              <div className="fb__card-shimmer" />
              <div className="fb__quote-mark">"</div>
              <p className="fb__comment">{current.comment}</p>

              <div className="fb__card-footer">
                <div className="fb__author">
                  <div className="fb__avatar">
                    {current.participantName?.[0]?.toUpperCase() || "P"}
                  </div>
                  <div>
                    <div className="fb__author-name">{current.participantName}</div>
                    <div className="fb__camp-label">{current.campName}</div>
                  </div>
                </div>
                <StarRating rating={current.rating || 0} />
              </div>
            </div>

            {/* nav row */}
            <div className="fb__controls">
              <button className="fb__nav" onClick={prev} aria-label="Previous review">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
              </button>

              <div className="fb__dots">
                {feedback.map((_, i) => (
                  <button
                    key={i}
                    className={`fb__dot ${i === active ? "fb__dot--on" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>

              <button className="fb__nav" onClick={next} aria-label="Next review">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="fb__counter">
              {String(active + 1).padStart(2, "0")}
              <span className="fb__counter-div"> / </span>
              {String(count).padStart(2, "0")}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;