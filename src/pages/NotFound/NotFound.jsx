import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    };

    setCanvasSize();

    const onResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", onResize);

    const DOTS = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.05,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      DOTS.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,170,204,${d.a})`;
        ctx.fill();
      });

      for (let i = 0; i < DOTS.length; i++) {
        for (let j = i + 1; j < DOTS.length; j++) {
          const dx = DOTS[i].x - DOTS[j].x;
          const dy = DOTS[i].y - DOTS[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(DOTS[i].x, DOTS[i].y);
            ctx.lineTo(DOTS[j].x, DOTS[j].y);
            ctx.strokeStyle = `rgba(34,170,204,${0.06 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="nf">
      <canvas ref={canvasRef} className="nf__canvas" />

      <div className="nf__content">
        <div className="nf__number" data-text="404">
          404
        </div>

        <div className="nf__cross">
          <span className="nf__cross-h" />
          <span className="nf__cross-v" />
        </div>

        <h1 className="nf__title">Page Not Found</h1>

        <p className="nf__desc">
          The page you&apos;re looking for has moved, been removed, or never
          existed. Let&apos;s get you back on track.
        </p>

        <div className="nf__actions">
          <Link to="/" className="nf__btn nf__btn--primary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>

          <Link to="/available-camps" className="nf__btn nf__btn--ghost">
            Browse Camps
          </Link>

          <button
            type="button"
            className="nf__btn nf__btn--back"
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
        </div>

        <div className="nf__links">
          <span className="nf__links-label">Quick links:</span>
          <Link to="/login" className="nf__link">
            Login
          </Link>
          <span className="nf__links-sep">·</span>
          <Link to="/register" className="nf__link">
            Register
          </Link>
          <span className="nf__links-sep">·</span>
          <Link to="/about" className="nf__link">
            About
          </Link>
          <span className="nf__links-sep">·</span>
          <Link to="/dashboard/profile" className="nf__link">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;