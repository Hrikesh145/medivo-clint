import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import "./PopularCamps.css";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const API = import.meta.env.VITE_API_URL || "https://medivo-server.vercel.app";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
};

const SkeletonCard = () => (
  <div className="pc__skeleton">
    <div className="pc__skeleton-img" />
    <div className="pc__skeleton-body">
      <div className="pc__skeleton-line" style={{ width: "75%" }} />
      <div className="pc__skeleton-line" style={{ width: "50%" }} />
      <div className="pc__skeleton-line" style={{ width: "90%" }} />
      <div className="pc__skeleton-line" style={{ width: "65%" }} />
    </div>
  </div>
);

const PopularCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── top 6 camps by participantCount
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["popular-camps"],
    queryFn: async () => {
      const res = await axios.get(`${API}/camps`);
      return res.data
        .sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0))
        .slice(0, 6);
    },
  });

  // ── participant's own registrations (joined state)
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ["my-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations?participantEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const joinedCampIds = useMemo(() => new Set(
    myRegistrations
      .filter((r) => r.status !== "cancelled")
      .map((r) => r.campId)
  ), [myRegistrations]);

  // ── identical join logic to AvailableCamps
  const handleJoin = async (camp) => {
    if (!user) {
      toast.error("Please login to join a camp");
      navigate("/login");
      return;
    }
    if (camp.participantCount >= camp.maxParticipants) return;

    const result = await Swal.fire({
      title: "Join Camp?",
      html: `<span style="color:rgba(240,244,255,0.6);font-size:14px;">
        You are about to join <strong style="color:#5EC8E0">${camp.name}</strong>
      </span>`,
      icon: "question",
      showCancelButton: true,
      background: "#10152A",
      color: "#F0F4FF",
      confirmButtonColor: "#116878",
      cancelButtonColor: "rgba(240,244,255,0.08)",
      confirmButtonText: "Join",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.post("/registrations", {
        campId:           camp._id,
        campName:         camp.name,
        fees:             camp.fees,
        location:         camp.location,
        startDateTime:    camp.startDateTime,
        endDateTime:      camp.endDateTime,
        participantEmail: user.email,
        participantName:  user.displayName,
        organizerEmail:   camp.organizerEmail,
        status:           "pending",
        paymentStatus:    camp.fees > 0 ? "unpaid" : "free",
        joinedAt:         new Date().toISOString(),
      });

      await axiosSecure.patch(`/camps/${camp._id}/join`);

      queryClient.invalidateQueries(["my-registrations", user?.email]);
      queryClient.invalidateQueries(["popular-camps"]);
      queryClient.invalidateQueries(["camps"]);

      const r2 = await Swal.fire({
        title: "Joined!",
        html: `<p style="color:rgba(240,244,255,0.6);font-size:14px;">
          You have successfully joined <strong style="color:#5EC8E0">${camp.name}</strong>.
        </p>`,
        icon: "success",
        background: "#10152A",
        color: "#F0F4FF",
        confirmButtonColor: "#116878",
        confirmButtonText: "View My Camps",
        showCancelButton: true,
        cancelButtonText: "Stay Here",
        cancelButtonColor: "#1A2240",
      });

      if (r2.isConfirmed) navigate("/dashboard/registered-camps");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to join camp");
    }
  };

  return (
    <section className="pc">
      <div className="pc__bg-glow pc__bg-glow--left"  />
      <div className="pc__bg-glow pc__bg-glow--right" />

      <div className="pc__inner">

        {/* header */}
        <div className="pc__header">
          <div className="pc__tag">
            <span className="pc__tag-line" />
            <span className="pc__tag-text">Most Popular</span>
            <span className="pc__tag-line" />
          </div>
          <h2 className="pc__title">
            Popular Medical
            <em> Camps</em>
          </h2>
          <p className="pc__sub">
            Discover the most attended camps across Bangladesh — trusted by thousands of participants.
          </p>
        </div>

        {/* grid */}
        <div className="pc__grid">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : camps.map((camp, idx) => {
                const isFull   = camp.participantCount >= camp.maxParticipants;
                const isJoined = joinedCampIds.has(camp._id);
                const pct      = camp.maxParticipants
                  ? Math.min((camp.participantCount / camp.maxParticipants) * 100, 100)
                  : 0;

                return (
                  <div
                    key={camp._id}
                    className="pc__card"
                    style={{ animationDelay: `${idx * 0.07}s` }}
                  >
                    {/* rank */}
                    <div className={`pc__rank pc__rank--${idx < 3 ? "top" : "normal"}`}>
                      #{idx + 1}
                    </div>

                    {/* image */}
                    <div className="pc__card-img">
                      {camp.image ? (
                        <img src={camp.image} alt={camp.name} loading="lazy" />
                      ) : (
                        <div className="pc__card-img-placeholder">
                          <svg width="40" height="40" viewBox="0 0 18 18" fill="none" opacity="0.12">
                            <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="#5EC8E0" />
                            <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="#5EC8E0" />
                          </svg>
                        </div>
                      )}
                      <div className="pc__card-img-overlay" />

                      <div className={`pc__fees ${camp.fees === 0 ? "pc__fees--free" : ""}`}>
                        {camp.fees === 0 ? "Free" : `$${camp.fees}`}
                      </div>

                      <div className={`pc__status ${isFull ? "pc__status--full" : isJoined ? "pc__status--joined" : "pc__status--open"}`}>
                        <span className="pc__status-dot" />
                        {isFull ? "Full" : isJoined ? "Joined" : "Open"}
                      </div>
                    </div>

                    {/* body */}
                    <div className="pc__card-body">
                      <h3 className="pc__card-name">{camp.name}</h3>

                      <div className="pc__card-professional">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {camp.healthcareProfessional}
                      </div>

                      <div className="pc__card-meta">
                        <div className="pc__meta-row">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <path d="M16 2v4M8 2v4M3 10h18"/>
                          </svg>
                          <span>{formatDate(camp.startDateTime)}</span>
                          {camp.startDateTime && (
                            <span className="pc__meta-time">{formatTime(camp.startDateTime)}</span>
                          )}
                        </div>
                        <div className="pc__meta-row">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                            <circle cx="12" cy="9" r="2.5"/>
                          </svg>
                          <span>{camp.location}</span>
                        </div>
                      </div>

                      {/* participant bar */}
                      <div className="pc__participants">
                        <div className="pc__participants-row">
                          <div className="pc__participants-label">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Participants
                          </div>
                          <div className="pc__participants-count">
                            <span className="pc__participants-num">{camp.participantCount || 0}</span>
                            <span className="pc__participants-max">/ {camp.maxParticipants}</span>
                          </div>
                        </div>
                        <div className="pc__bar">
                          <div
                            className={`pc__bar-fill ${isFull ? "pc__bar-fill--full" : ""}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* join button — same behaviour as AvailableCamps */}
                      {isJoined ? (
                        <button
                          className="pc__btn pc__btn--joined"
                          onClick={() => navigate("/dashboard/registered-camps")}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          View My Registration
                        </button>
                      ) : (
                        <button
                          className={`pc__btn ${isFull ? "pc__btn--full" : "pc__btn--join"}`}
                          onClick={() => handleJoin(camp)}
                          disabled={isFull}
                        >
                          {isFull ? "Camp Full" : "Join Camp"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* see all */}
        <div className="pc__footer">
          <Link to="/available-camps" className="pc__see-all">
            <span>See All Camps</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PopularCamps;