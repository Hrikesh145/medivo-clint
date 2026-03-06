import React from "react";

const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: { icon: "w-7 h-7 rounded-lg",   svg: 14, text: "text-[18px]", tracking: "4px" },
    md: { icon: "w-10 h-10 rounded-xl", svg: 18, text: "text-[26px]", tracking: "6px" },
    lg: { icon: "w-14 h-14 rounded-2xl",svg: 24, text: "text-[38px]", tracking: "8px" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">

      {/* Icon */}
      <div
        className={`relative ${s.icon} flex items-center justify-center shrink-0`}
        style={{
          background: "linear-gradient(135deg, #0E5060, #1688A0)",
          border: "1px solid rgba(34,170,204,0.35)",
          boxShadow: "0 0 20px rgba(22,136,160,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)" }}
        />
        <svg width={s.svg} height={s.svg} viewBox="0 0 18 18" fill="none">
          <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="#5EC8E0" />
          <rect x="1"   y="7.5" width="16" height="3" rx="1.5" fill="#5EC8E0" />
        </svg>
      </div>

      {/* Wordmark — single element, no split gap */}
      <span
        className={`font-teko font-light uppercase ${s.text}`}
        style={{ letterSpacing: s.tracking, lineHeight: 1 }}
      >
        MEDI
        <span
          style={{
            color: "transparent",
            WebkitTextStroke: "1px #22AACC",
            filter: "drop-shadow(0 0 8px rgba(34,170,204,0.7))",
          }}
        >
          VO
        </span>
      </span>

    </div>
  );
};

export default Logo;