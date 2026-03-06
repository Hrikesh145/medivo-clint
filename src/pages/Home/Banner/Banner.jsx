import React, { useState } from "react";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1800&q=80";
const CARD_IMAGE =
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=70";

// ── TODO: replace with useQuery(() => axios.get('/camps/featured'))
const featuredCamp = {
  _id: null,
  title: "Free Eye Care Camp — Dhaka 2025",
  fee: 80,
  date: "March 15, 2025 · 9:00 AM – 5:00 PM",
  location: "Dhaka Medical College, Ward 3",
  doctor: "Dr. Rahman Karim",
  specialty: "Ophthalmologist",
  registered: 142,
};

const STATS = [
  { val: "10K+", lbl: "Participants",  desc: "Across all camps"    },
  { val: "250+", lbl: "Camps Held",    desc: "Nationwide coverage" },
  { val: "98%",  lbl: "Satisfaction",  desc: "Post-camp surveys"   },
  { val: "4.9★", lbl: "Avg Rating",    desc: "Verified reviews"    },
];

const META = [
  { icon: "📅", key: "date"     },
  { icon: "📍", key: "location" },
  { icon: "👨‍⚕️", key: "doctor", suffix: (c) => ` · ${c.specialty}` },
];

const Banner = () => {

  // ── TODO: replace with useForm() from react-hook-form
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // ── TODO: replace with useMutation(() => axios.post('/registrations', data))
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register →", { campId: featuredCamp._id, ...form });
  };

  return (
    <section
      className="relative w-full min-h-screen flex flex-col overflow-hidden
                 rounded-2xl sm:rounded-3xl"
    >
      {/* ══════════════════════════════════════
          BG LAYERS
      ══════════════════════════════════════ */}

      {/* image */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.45) brightness(0.65)",
        }}
      />

      {/* dark overlay */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl"
        style={{
          background:
            "linear-gradient(108deg,rgba(3,4,7,0.97) 0%,rgba(6,40,48,0.90) 25%,rgba(3,4,7,0.70) 55%,rgba(3,4,7,0.88) 100%)",
        }}
      />

      {/* scan lines */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(240,244,255,0.009) 2px,rgba(240,244,255,0.009) 3px)",
        }}
      />

      {/* coordinate grid — right half */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,170,204,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,170,204,0.04) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
          WebkitMaskImage:
            "linear-gradient(90deg,rgba(3,4,7,1) 0%,rgba(3,4,7,0.1) 50%,transparent 100%)",
          maskImage:
            "linear-gradient(90deg,rgba(3,4,7,1) 0%,rgba(3,4,7,0.1) 50%,transparent 100%)",
        }}
      />

      {/* incision line */}
      <div
        className="absolute left-0 right-0 h-px z-[4] pointer-events-none"
        style={{
          top: "57%",
          background:
            "linear-gradient(90deg,transparent 0%,rgba(22,136,160,0.4) 5%,#22AACC 25%,#5EC8E0 50%,#22AACC 75%,rgba(22,136,160,0.4) 95%,transparent 100%)",
          boxShadow:
            "0 0 28px rgba(34,170,204,0.45),0 0 56px rgba(22,136,160,0.15)",
        }}
      />

      {/* top membrane line */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-[6] pointer-events-none rounded-t-2xl sm:rounded-t-3xl"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,#1688A0 20%,#22AACC 50%,#1688A0 80%,transparent 100%)",
          boxShadow: "0 0 20px rgba(22,136,160,0.5)",
        }}
      />

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div
        className="relative z-[5] flex-1
                   grid grid-cols-1 lg:grid-cols-2
                   gap-10 items-center
                   px-5 sm:px-10 lg:px-16 xl:px-20
                   pt-28 sm:pt-32 pb-36 sm:pb-44"
      >

        {/* ── LEFT ── */}
        <div className="flex flex-col">

          {/* signal */}
          <div className="inline-flex items-center gap-3 mb-10">
            <span
              className="w-[6px] h-[6px] rounded-full shrink-0"
              style={{
                background: "#22AACC",
                boxShadow: "0 0 8px #22AACC,0 0 20px rgba(34,170,204,0.5)",
                animation: "breathe 3s ease-in-out infinite",
              }}
            />
            <span
              className="w-9 h-px shrink-0"
              style={{ background: "linear-gradient(90deg,#22AACC,transparent)" }}
            />
            <span
              className="font-teko text-[12px] tracking-[4px] uppercase"
              style={{ color: "#22AACC" }}
            >
              Medical Camp Management · 2025
            </span>
          </div>

          {/* headline */}
          <h1
            className="font-teko font-light uppercase leading-[0.88] mb-6"
            style={{ fontSize: "clamp(58px,7.5vw,118px)", letterSpacing: "4px" }}
          >
            {["WHERE", "CARE", "MEETS", "SCIENCE"].map((word, i) =>
              i % 2 === 0 ? (
                <span
                  key={word}
                  className="block"
                  style={{ color: "rgba(240,244,255,0.96)" }}
                >
                  {word}
                </span>
              ) : (
                <span
                  key={word}
                  className="block"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px #22AACC",
                    filter: "drop-shadow(0 0 18px rgba(34,170,204,0.65))",
                  }}
                >
                  {word}
                </span>
              )
            )}
          </h1>

          {/* subtitle */}
          <p
            className="font-cormorant italic font-light mb-11 max-w-md"
            style={{
              fontSize: "clamp(15px,1.5vw,19px)",
              color: "rgba(240,244,255,0.40)",
              lineHeight: 1.8,
            }}
          >
            Connecting communities with certified physicians through organized
            medical camps — precise, accessible, and life-changing.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              className="font-geologica text-[11px] font-semibold uppercase
                         tracking-[2px] px-8 py-[13px] rounded-full
                         transition-all duration-300 hover:-translate-y-[2px]"
              style={{
                background: "linear-gradient(135deg,#0E5060,#1688A0)",
                color: "rgba(240,244,255,1)",
                border: "1px solid rgba(34,170,204,0.4)",
                boxShadow:
                  "0 0 28px rgba(22,136,160,0.3),inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 48px rgba(22,136,160,0.55)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 0 28px rgba(22,136,160,0.3),inset 0 1px 0 rgba(255,255,255,0.08)")
              }
            >
              Explore All Camps →
            </button>
            <button
              className="font-geologica text-[11px] font-light uppercase
                         tracking-[2px] px-8 py-[13px] rounded-full
                         transition-all duration-300"
              style={{
                background: "rgba(240,244,255,0.04)",
                color: "rgba(240,244,255,0.45)",
                border: "1px solid rgba(240,244,255,0.10)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(240,244,255,0.08)";
                e.currentTarget.style.color = "rgba(240,244,255,0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(240,244,255,0.04)";
                e.currentTarget.style.color = "rgba(240,244,255,0.45)";
              }}
            >
              How It Works
            </button>
          </div>
        </div>

        {/* ── RIGHT — GLASS CAMP CARD ── */}
        <div className="flex justify-center lg:justify-end items-center">
          <div
            className="w-full max-w-[400px] rounded-[22px] overflow-hidden relative"
            style={{
              background: "rgba(10,15,32,0.72)",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              border: "1px solid rgba(240,244,255,0.09)",
              boxShadow:
                "0 32px 80px rgba(3,4,7,0.7),0 8px 24px rgba(3,4,7,0.5)",
              animation: "floatCard 6s ease-in-out infinite",
            }}
          >
            {/* card top membrane */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-[2] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg,transparent,#22AACC,transparent)",
                boxShadow: "0 0 16px rgba(34,170,204,0.5)",
              }}
            />

            {/* ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none z-[0]"
              style={{
                background:
                  "radial-gradient(ellipse at top left,rgba(14,80,96,0.15),transparent 60%)",
              }}
            />

            {/* header image */}
            <div
              className="relative h-[140px] overflow-hidden flex items-end p-4"
              style={{
                backgroundImage: `linear-gradient(135deg,rgba(6,40,48,0.9),rgba(14,80,96,0.7)),url(${CARD_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg,transparent,transparent 16px,rgba(34,170,204,0.03) 16px,rgba(34,170,204,0.03) 17px)",
                }}
              />
              <div className="relative z-[1] flex items-center gap-2 flex-1">
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0"
                  style={{
                    background: "#22AACC",
                    boxShadow: "0 0 6px #22AACC",
                    animation: "breathe 2s ease-in-out infinite",
                  }}
                />
                <span
                  className="font-teko text-[11px] tracking-[3px] uppercase"
                  style={{ color: "#5EC8E0" }}
                >
                  Featured Camp
                </span>
                <div
                  className="ml-auto font-teko text-[14px] tracking-[1px] px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(3,4,7,0.8)",
                    border: "1px solid rgba(34,170,204,0.3)",
                    color: "#5EC8E0",
                  }}
                >
                  ${featuredCamp.fee}
                </div>
              </div>
            </div>

            {/* body */}
            <div className="relative z-[1] px-5 pt-5 pb-4">
              <h3
                className="font-cormorant font-light mb-4 leading-snug"
                style={{
                  fontSize: "18px",
                  color: "rgba(240,244,255,0.92)",
                  letterSpacing: "0.3px",
                }}
              >
                {featuredCamp.title}
              </h3>

              {/* meta */}
              <div className="flex flex-col gap-2 mb-4">
                {META.map(({ icon, key, suffix }) => (
                  <div
                    key={key}
                    className="flex items-center gap-[10px] text-[12px] font-light"
                    style={{ color: "rgba(240,244,255,0.40)" }}
                  >
                    <span
                      className="w-[22px] h-[22px] rounded-[6px] flex items-center
                                 justify-center text-[10px] shrink-0"
                      style={{
                        background: "rgba(22,136,160,0.10)",
                        border: "1px solid rgba(34,170,204,0.15)",
                      }}
                    >
                      {icon}
                    </span>
                    {featuredCamp[key]}
                    {suffix?.(featuredCamp)}
                  </div>
                ))}
              </div>

              {/* divider */}
              <div
                className="h-px mb-4"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(34,170,204,0.2),rgba(240,244,255,0.04),transparent)",
                }}
              />

              {/* quick registration form
                  ── TODO: replace useState + handleRegister with:
                     const { register, handleSubmit } = useForm()
                     const { mutate } = useMutation(data => axios.post('/registrations', data))
              */}
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <span
                  className="font-teko text-[11px] tracking-[3px] uppercase"
                  style={{ color: "rgba(240,244,255,0.25)" }}
                >
                  Quick Registration
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "name",  placeholder: "Full Name" },
                    { name: "phone", placeholder: "Phone"     },
                  ].map((field) => (
                    <input
                      key={field.name}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      // ── TODO: replace with {...register(field.name, { required: true })}
                      className="px-3 py-[9px] rounded-lg text-[12px]
                                 font-light outline-none transition-all duration-200"
                      style={{
                        background: "rgba(240,244,255,0.04)",
                        border: "1px solid rgba(240,244,255,0.08)",
                        color: "rgba(240,244,255,0.7)",
                        fontFamily: "'Geologica', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(34,170,204,0.4)";
                        e.target.style.background  = "rgba(22,136,160,0.08)";
                        e.target.style.boxShadow   = "0 0 0 3px rgba(22,136,160,0.10)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(240,244,255,0.08)";
                        e.target.style.background  = "rgba(240,244,255,0.04)";
                        e.target.style.boxShadow   = "none";
                      }}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-[11px] rounded-lg font-geologica text-[11px]
                             font-semibold uppercase tracking-[2px]
                             transition-all duration-300 hover:-translate-y-[1px]"
                  style={{
                    background: "linear-gradient(135deg,#0E5060,#1688A0)",
                    border: "1px solid rgba(34,170,204,0.35)",
                    color: "rgba(240,244,255,0.95)",
                    boxShadow:
                      "0 0 20px rgba(22,136,160,0.2),inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 36px rgba(22,136,160,0.45)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(22,136,160,0.2),inset 0 1px 0 rgba(255,255,255,0.06)")
                  }
                >
                  Register Now →
                </button>
              </form>
            </div>

            {/* footer */}
            <div
              className="relative z-[1] px-5 py-3 flex items-center justify-between"
              style={{
                borderTop: "1px solid rgba(240,244,255,0.05)",
                background: "rgba(3,4,7,0.3)",
              }}
            >
              <div className="flex">
                {["J", "A", "R", "+"].map((av, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full flex items-center
                               justify-center text-[10px] font-medium"
                    style={{
                      background: "linear-gradient(135deg,#0E5060,#1688A0)",
                      border: "1.5px solid rgba(3,4,7,0.8)",
                      color: "rgba(240,244,255,0.8)",
                      marginLeft: i === 0 ? 0 : "-6px",
                    }}
                  >
                    {av}
                  </div>
                ))}
              </div>
              <span
                className="font-geologica text-[11px] font-light"
                style={{ color: "rgba(240,244,255,0.35)" }}
              >
                <span style={{ color: "#5EC8E0", fontWeight: 500 }}>
                  {featuredCamp.registered}
                </span>{" "}
                already registered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM STATS STRIP
      ══════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5]
                   rounded-b-2xl sm:rounded-b-3xl overflow-hidden"
        style={{
          background: "rgba(5,7,14,0.88)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(240,244,255,0.06)",
        }}
      >
        {/* teal rule */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent 0%,#1688A0 15%,#22AACC 50%,#1688A0 85%,transparent 100%)",
            boxShadow: "0 0 16px rgba(22,136,160,0.35)",
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.lbl}
              className="flex flex-col items-center justify-center gap-1
                         py-5 relative transition-colors duration-200
                         hover:bg-[rgba(22,136,160,0.04)] group"
              style={{
                borderRight:
                  i < STATS.length - 1
                    ? "1px solid rgba(240,244,255,0.05)"
                    : "none",
              }}
            >
              <div
                className="absolute left-0 top-[20%] bottom-[20%] w-[1.5px] rounded-full
                           opacity-0 group-hover:opacity-80 transition-opacity duration-200"
                style={{
                  background:
                    "linear-gradient(to bottom,transparent,#22AACC,transparent)",
                }}
              />
              <span
                className="font-teko font-light leading-none"
                style={{
                  fontSize: "30px",
                  letterSpacing: "2px",
                  color: "#5EC8E0",
                  filter: "drop-shadow(0 0 8px rgba(94,200,224,0.35))",
                }}
              >
                {stat.val}
              </span>
              <span
                className="font-geologica font-light uppercase tracking-[2.5px] text-center"
                style={{ fontSize: "9px", color: "rgba(240,244,255,0.28)" }}
              >
                {stat.lbl}
              </span>
              <span
                className="font-geologica font-light text-center hidden sm:block"
                style={{ fontSize: "10px", color: "rgba(240,244,255,0.18)" }}
              >
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes breathe {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.35; transform:scale(0.7); }
        }
        @keyframes floatCard {
          0%,100% { transform:translateY(0px); }
          50%      { transform:translateY(-10px); }
        }
      `}</style>
    </section>
  );
};

export default Banner;