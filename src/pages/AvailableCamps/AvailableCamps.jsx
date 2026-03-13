import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import "./AvailableCamps.css";

const formatDateRange = (start, end) => {
  if (!start) return "—";
  const s = new Date(start);
  const e = new Date(end);
  const opts = { day: "numeric", month: "short", year: "numeric" };
  return `${s.toLocaleDateString("en-GB", opts)} — ${e.toLocaleDateString("en-GB", opts)}`;
};

const formatTimeRange = (start, end) => {
  if (!start) return "";
  const opts = { hour: "2-digit", minute: "2-digit" };
  return `${new Date(start).toLocaleTimeString("en-US", opts)} → ${new Date(end).toLocaleTimeString("en-US", opts)}`;
};

const SkeletonCard = () => (
  <div className="ac__skeleton">
    <div className="ac__skeleton-img" />
    <div className="ac__skeleton-body">
      <div className="ac__skeleton-line" style={{ width: "70%" }} />
      <div className="ac__skeleton-line" style={{ width: "45%" }} />
      <div className="ac__skeleton-line" style={{ width: "90%" }} />
      <div className="ac__skeleton-line" style={{ width: "60%" }} />
    </div>
  </div>
);

const AvailableCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("most-registered");
  const [layout,  setLayout]  = useState(3);

  // ── fetch all camps
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/camps");
      return res.data;
    },
  });

  // ── fetch participant's own registrations to know which camps are already joined
  const { data: myRegistrations = [] } = useQuery({
    queryKey: ["my-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations?participantEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // set of campIds already joined (non-cancelled)
  const joinedCampIds = useMemo(() => {
    return new Set(
      myRegistrations
        .filter((r) => r.status !== "cancelled")
        .map((r) => r.campId)
    );
  }, [myRegistrations]);

  // ── filter + sort
  const displayed = useMemo(() => {
    let list = [...camps];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.healthcareProfessional?.toLowerCase().includes(q)
      );
    }
    if (sort === "most-registered") {
      list.sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0));
    } else if (sort === "lowest-fees") {
      list.sort((a, b) => (a.fees || 0) - (b.fees || 0));
    } else if (sort === "a-z") {
      list.sort((a, b) => a.name?.localeCompare(b.name));
    } else if (sort === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [camps, search, sort]);

  // ── stats
  const activeCamps      = camps.filter((c) => c.participantCount < c.maxParticipants).length;
  const totalParticipants = camps.reduce((sum, c) => sum + (c.participantCount || 0), 0);
  const freeCamps        = camps.filter((c) => !c.fees || c.fees === 0).length;
  const joinedCount      = joinedCampIds.size;

  const handleJoin = async (camp) => {
    if (!user) {
      toast.error("Please login to join a camp");
      return;
    }
    if (camp.participantCount >= camp.maxParticipants) return;

    Swal.fire({
      title: "Join Camp?",
      html: `<span style="color:rgba(240,244,255,0.6); font-size:14px;">
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
    }).then(async (result) => {
      if (result.isConfirmed) {
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

          // increment participant count
          await axiosSecure.patch(`/camps/${camp._id}/join`);

          // invalidate so joined badge updates immediately
          queryClient.invalidateQueries(["my-registrations", user?.email]);
          queryClient.invalidateQueries(["camps"]);

          await Swal.fire({
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
          }).then((r) => {
            if (r.isConfirmed) {
              navigate("/dashboard/registered-camps");
            }
          });
        } catch (err) {
          toast.error(err?.response?.data?.message || "Failed to join camp");
        }
      }
    });
  };

  return (
    <div className="ac">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#10152A",
            color: "#F0F4FF",
            border: "1px solid rgba(34,170,204,0.2)",
            fontFamily: "Geologica, sans-serif",
            fontSize: "13px",
          },
        }}
      />

      {/* ── hero ── */}
      <section className="ac__hero">
        <div className="ac__hero-inner">
          <div className="ac__tag">
            <span className="ac__tag-line" />
            <span className="ac__tag-text">Medical Camps</span>
          </div>
          <h1 className="ac__title">
            Available
            <em>Camps</em>
          </h1>
          <p className="ac__subtitle">
            Discover free and affordable medical camps near you — search,
            filter, and join in seconds.
          </p>

          {/* ── stats strip ── */}
          <div className="ac__stats">
            <div>
              <div className="ac__stat-num ac__stat-num--teal">{activeCamps}</div>
              <div className="ac__stat-label">Active Camps</div>
            </div>
            <div className="ac__stat-divider" />
            <div>
              <div className="ac__stat-num">{totalParticipants.toLocaleString()}</div>
              <div className="ac__stat-label">Participants</div>
            </div>
            <div className="ac__stat-divider" />
            <div>
              <div className="ac__stat-num">{camps.length}</div>
              <div className="ac__stat-label">Total Camps</div>
            </div>
            <div className="ac__stat-divider" />
            <div>
              <div className="ac__stat-num ac__stat-num--green">{freeCamps}</div>
              <div className="ac__stat-label">Free Camps</div>
            </div>
            {user && (
              <>
                <div className="ac__stat-divider" />
                <div>
                  <div className="ac__stat-num ac__stat-num--purple">{joinedCount}</div>
                  <div className="ac__stat-label">You've Joined</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── controls ── */}
      <div className="ac__controls">
        <div className="ac__search">
          <svg className="ac__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="ac__search-input"
            placeholder="Search by camp name, location, or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ac__sort">
          <span className="ac__sort-label">Sort</span>
          <select
            className="ac__sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="most-registered">Most Registered</option>
            <option value="lowest-fees">Lowest Fees</option>
            <option value="a-z">A → Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="ac__layout-toggle">
          <button
            className={`ac__layout-btn ${layout === 3 ? "ac__layout-btn--active" : ""}`}
            onClick={() => setLayout(3)}
            title="3 columns"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1"  y="1" width="4" height="14" rx="1.5" fill="#5EC8E0" />
              <rect x="6"  y="1" width="4" height="14" rx="1.5" fill="#5EC8E0" />
              <rect x="11" y="1" width="4" height="14" rx="1.5" fill="#5EC8E0" />
            </svg>
          </button>
          <button
            className={`ac__layout-btn ${layout === 2 ? "ac__layout-btn--active" : ""}`}
            onClick={() => setLayout(2)}
            title="2 columns"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="14" rx="1.5" fill="#5EC8E0" />
              <rect x="9" y="1" width="6" height="14" rx="1.5" fill="#5EC8E0" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── grid ── */}
      <div className={`ac__grid ${layout === 2 ? "ac__grid--two" : ""}`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : displayed.length === 0 ? (
          <div className="ac__empty">
            <div className="ac__empty-title">No camps found</div>
            <div className="ac__empty-sub">Try adjusting your search or check back later</div>
          </div>
        ) : (
          displayed.map((camp) => {
            const isFull    = camp.participantCount >= camp.maxParticipants;
            const isJoined  = joinedCampIds.has(camp._id);
            const pct       = camp.maxParticipants
              ? Math.min((camp.participantCount / camp.maxParticipants) * 100, 100)
              : 0;
            const initial   = camp.organizerName?.[0]?.toUpperCase() || "O";

            return (
              <div key={camp._id} className={`ac__card ${isJoined ? "ac__card--joined" : ""}`}>

                {/* image */}
                <div className="ac__card-img">
                  {camp.image ? (
                    <img src={camp.image} alt={camp.name} />
                  ) : (
                    <div className="ac__card-img-placeholder">
                      <svg width="52" height="52" viewBox="0 0 18 18" fill="none" opacity="0.1">
                        <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="#5EC8E0" />
                        <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="#5EC8E0" />
                      </svg>
                    </div>
                  )}
                  <div className="ac__card-img-overlay" />

                  {/* status */}
                  <div className={`ac__card-status ${isFull ? "ac__card-status--full" : isJoined ? "ac__card-status--joined" : "ac__card-status--active"}`}>
                    <span className="ac__card-status-dot" />
                    {isFull ? "Full" : isJoined ? "Joined" : "Active"}
                  </div>

                  {/* fees */}
                  <div className={`ac__card-fees ${camp.fees === 0 ? "ac__card-fees--free" : ""}`}>
                    {camp.fees === 0 ? "Free" : `$${camp.fees}`}
                  </div>
                </div>

                {/* body */}
                <div className="ac__card-body">
                  <div className="ac__card-name">{camp.name}</div>
                  <div className="ac__card-professional">{camp.healthcareProfessional}</div>

                  <div className="ac__card-meta">
                    <div className="ac__card-meta-row">
                      <svg className="ac__card-meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      <span className="ac__card-meta-text">
                        {formatDateRange(camp.startDateTime, camp.endDateTime)}
                        {" · "}
                        {formatTimeRange(camp.startDateTime, camp.endDateTime)}
                      </span>
                    </div>
                    <div className="ac__card-meta-row">
                      <svg className="ac__card-meta-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span className="ac__card-meta-text">{camp.location}</span>
                    </div>
                  </div>

                  {/* participants progress */}
                  <div className="ac__card-participants">
                    <div className="ac__card-participants-top">
                      <span className="ac__card-participants-label">Participants</span>
                      <span className="ac__card-participants-count">
                        <span>{camp.participantCount}</span> / {camp.maxParticipants}
                      </span>
                    </div>
                    <div className="ac__progress">
                      <div
                        className={`ac__progress-fill ${isFull ? "ac__progress-fill--full" : ""}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className="ac__card-footer">
                  <div className="ac__card-organizer">
                    <div className="ac__card-organizer-avatar">{initial}</div>
                    <span className="ac__card-organizer-name">{camp.organizerName}</span>
                  </div>

                  {isJoined ? (
                    <button
                      className="ac__btn-join ac__btn-join--joined"
                      onClick={() => navigate("/dashboard/registered-camps")}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      View Camp
                    </button>
                  ) : (
                    <button
                      className={`ac__btn-join ${isFull ? "ac__btn-join--full" : ""}`}
                      onClick={() => !isFull && handleJoin(camp)}
                      disabled={isFull}
                    >
                      {isFull ? "Camp Full" : "Join Camp"}
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AvailableCamps;