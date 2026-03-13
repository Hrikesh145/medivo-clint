import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import "./RegisteredCamps.css";

const RegisteredCamps = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ── fetch registrations
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registrations?participantEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ── cancel registration
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/registrations/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations", user?.email]);
    },
  });

  const handleCancel = (id, campName) => {
    Swal.fire({
      title: "Cancel Registration?",
      html: `<p style="color:rgba(240,244,255,0.5);font-size:13px;">You are about to cancel your registration for<br/><strong style="color:rgba(240,244,255,0.8);">${campName}</strong></p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Keep It",
      background: "#10152A",
      color: "#f0f4ff",
      confirmButtonColor: "#c46a80",
      cancelButtonColor: "#1a2240",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(id);
        Swal.fire({
          title: "Cancelled",
          text: "Your registration has been cancelled.",
          icon: "success",
          background: "#10152A",
          color: "#f0f4ff",
          confirmButtonColor: "#1688A0",
        });
      }
    });
  };

  // ── feedback modal
  const [feedbackModal, setFeedbackModal] = useState(null); // { id, campName }
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const submitFeedback = async () => {
    if (!rating) {
      Swal.fire({ title: "Please select a rating", icon: "warning", background: "#10152A", color: "#f0f4ff", confirmButtonColor: "#1688A0" });
      return;
    }
    await axiosSecure.post("/feedback", {
      registrationId: feedbackModal.id,
      campId: feedbackModal.campId,
      campName: feedbackModal.campName,
      participantEmail: user.email,
      participantName: user.displayName,
      rating,
      comment: feedbackText,
      createdAt: new Date().toISOString(),
    });
    setFeedbackModal(null);
    setRating(0);
    setFeedbackText("");
    Swal.fire({ title: "Feedback Submitted!", icon: "success", background: "#10152A", color: "#f0f4ff", confirmButtonColor: "#1688A0" });
  };

  // ── filter + search
  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.campName?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "unpaid"    && r.paymentStatus === "unpaid") ||
      (filter === "confirmed" && r.status === "confirmed") ||
      (filter === "pending"   && r.status === "pending");
    return matchSearch && matchFilter;
  });

  // ── stats
  const total     = registrations.length;
  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const pending   = registrations.filter((r) => r.paymentStatus === "unpaid" && r.status !== "cancelled").length;
  const cancelled = registrations.filter((r) => r.status === "cancelled").length;

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) return (
    <div className="rc__loading">
      <div className="rc__loading-spinner" />
      <span>Loading registrations...</span>
    </div>
  );

  return (
    <div className="rc">
      {/* header */}
      <div className="rc__header">
        <div className="rc__tag">
          <span className="rc__tag-line" />
          <span className="rc__tag-text">Participant Panel</span>
        </div>
        <h1 className="rc__title">Registered Camps</h1>
        <p className="rc__sub">All camps you've joined — pay, cancel, or leave feedback.</p>
      </div>

      {/* stats */}
      <div className="rc__stats">
        <div className="rc__stat">
          <div className="rc__stat-num">{total}</div>
          <div className="rc__stat-label">Total Registered</div>
        </div>
        <div className="rc__stat rc__stat--green">
          <div className="rc__stat-num">{confirmed}</div>
          <div className="rc__stat-label">Confirmed</div>
        </div>
        <div className="rc__stat rc__stat--amber">
          <div className="rc__stat-num">{pending}</div>
          <div className="rc__stat-label">Pending Payment</div>
        </div>
        <div className="rc__stat rc__stat--rose">
          <div className="rc__stat-num">{cancelled}</div>
          <div className="rc__stat-label">Cancelled</div>
        </div>
      </div>

      {/* toolbar */}
      <div className="rc__toolbar">
        <div className="rc__search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search camps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="rc__filters">
          {["all", "unpaid", "confirmed", "pending"].map((f) => (
            <button
              key={f}
              className={`rc__filter-btn ${filter === f ? "rc__filter-btn--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="rc__card">
        {filtered.length === 0 ? (
          <div className="rc__empty">
            <div className="rc__empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(240,244,255,0.2)" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="rc__empty-title">No Registrations Found</div>
            <p className="rc__empty-sub">Join a camp from the Available Camps page.</p>
          </div>
        ) : (
          <table className="rc__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Camp</th>
                <th>Date Range</th>
                <th>Fees</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, idx) => {
                const isCancelled = reg.status === "cancelled";
                const isPaid      = reg.paymentStatus === "paid";
                const isFree      = reg.paymentStatus === "free" || reg.fees === 0 || reg.fees === "0";
                const isConfirmed = reg.status === "confirmed";
                const isUnpaid    = reg.paymentStatus === "unpaid";
                const isPending   = reg.status === "pending";

                return (
                  <tr key={reg._id} className={isCancelled ? "rc__row--cancelled" : ""}>
                    <td className="rc__num">{String(idx + 1).padStart(2, "0")}</td>

                    <td>
                      <div className="rc__camp-cell">
                        <div className="rc__camp-thumb">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,244,255,0.15)" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </div>
                        <div>
                          <div className="rc__camp-name">{reg.campName}</div>
                          <div className="rc__camp-loc">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                            {reg.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="rc__date">{formatDate(reg.startDateTime)}</div>
                      <div className="rc__date-range">→ {formatDate(reg.endDateTime)}</div>
                    </td>

                    <td>
                      <span className={`rc__fees ${isFree ? "rc__fees--free" : ""}`}>
                        {isFree ? "Free" : `$${reg.fees}`}
                      </span>
                    </td>

                    <td>
                      {isFree    && <span className="rc__badge rc__badge--free"><span className="rc__badge-dot"/>Free</span>}
                      {isPaid    && <span className="rc__badge rc__badge--paid"><span className="rc__badge-dot"/>Paid</span>}
                      {isUnpaid  && !isFree && <span className="rc__badge rc__badge--unpaid"><span className="rc__badge-dot"/>Unpaid</span>}
                    </td>

                    <td>
                      {isCancelled && <span className="rc__badge rc__badge--cancelled"><span className="rc__badge-dot"/>Cancelled</span>}
                      {isConfirmed && <span className="rc__badge rc__badge--confirmed"><span className="rc__badge-dot"/>Confirmed</span>}
                      {isPending   && !isCancelled && <span className="rc__badge rc__badge--pending"><span className="rc__badge-dot"/>Pending</span>}
                    </td>

                    <td>
                      <div className="rc__actions">
                        {/* unpaid + not cancelled → Pay Now */}
                        {isUnpaid && !isFree && !isCancelled && (
                          <button
                            className="rc__btn rc__btn--pay"
                            onClick={() => navigate(`/dashboard/payment/${reg._id}`)}
                          >
                            Pay Now
                          </button>
                        )}
                        {/* confirmed or paid → Feedback */}
                        {(isConfirmed || isPaid) && !isCancelled && (
                          <button
                            className="rc__btn rc__btn--feedback"
                            onClick={() => setFeedbackModal({ id: reg._id, campId: reg.campId, campName: reg.campName })}
                          >
                            Feedback
                          </button>
                        )}
                        {/* pending + not paid → Cancel */}
                        {isPending && !isPaid && !isCancelled && (
                          <button
                            className="rc__btn rc__btn--cancel"
                            onClick={() => handleCancel(reg._id, reg.campName)}
                          >
                            Cancel
                          </button>
                        )}
                        {/* cancelled → disabled */}
                        {isCancelled && (
                          <button className="rc__btn rc__btn--disabled" disabled>Cancelled</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* feedback modal */}
      {feedbackModal && (
        <div className="rc__modal-overlay" onClick={(e) => e.target === e.currentTarget && setFeedbackModal(null)}>
          <div className="rc__modal">
            <button className="rc__modal-close" onClick={() => setFeedbackModal(null)}>×</button>
            <div className="rc__modal-title">Leave Feedback</div>
            <p className="rc__modal-sub">{feedbackModal.campName}</p>

            <div className="rc__stars">
              {[1,2,3,4,5].map((n) => (
                <button key={n} className={`rc__star ${rating >= n ? "rc__star--active" : ""}`} onClick={() => setRating(n)}>⭐</button>
              ))}
            </div>

            <textarea
              className="rc__modal-textarea"
              placeholder="Write about your experience, the healthcare team, facilities..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />

            <div className="rc__modal-footer">
              <button className="rc__btn-ghost" onClick={() => setFeedbackModal(null)}>Cancel</button>
              <button className="rc__btn-submit" onClick={submitFeedback}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredCamps;