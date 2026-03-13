import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import "./ManageRegistered.css";

const ManageRegistered = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedReg, setSelectedReg] = useState(null);

  // ── fetch all registrations for organizer's camps
  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["organizer-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/registrations/organizer?organizerEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ── confirm mutation
  const confirmMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/registrations/${id}/confirm`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["organizer-registrations", user?.email]);
      Swal.fire({
        title: "Confirmed!",
        text: "Registration has been confirmed.",
        icon: "success",
        background: "#10152A",
        color: "#f0f4ff",
        confirmButtonColor: "#1688A0",
      });
    },
  });

  // ── reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, campId, isPaid }) => {
      await axiosSecure.patch(`/registrations/${id}/reject`, { campId, isPaid });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["organizer-registrations", user?.email]);
      setSelectedReg(null);
    },
  });

  const handleConfirm = (reg) => {
    Swal.fire({
      title: "Confirm Registration?",
      html: `<p style="color:rgba(240,244,255,0.5);font-size:13px;">Confirm <strong style="color:rgba(240,244,255,0.8);">${reg.participantName}</strong> for<br/><strong style="color:rgba(240,244,255,0.8);">${reg.campName}</strong>?</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
      background: "#10152A",
      color: "#f0f4ff",
      confirmButtonColor: "#1a6645",
      cancelButtonColor: "#1a2240",
    }).then((result) => {
      if (result.isConfirmed) confirmMutation.mutate(reg._id);
    });
  };

  const handleReject = (reg) => {
    const isPaid = reg.paymentStatus === "paid";
    Swal.fire({
      title: "Reject Registration?",
      html: `
        <p style="color:rgba(240,244,255,0.5);font-size:13px;">
          You are about to reject <strong style="color:rgba(240,244,255,0.8);">${reg.participantName}</strong>
          from <strong style="color:rgba(240,244,255,0.8);">${reg.campName}</strong>.
        </p>
        ${isPaid ? `<p style="color:#f0b432;font-size:12px;margin-top:10px;">⚠️ This participant has already paid. Cancellation will not auto-refund.</p>` : ""}
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Keep",
      background: "#10152A",
      color: "#f0f4ff",
      confirmButtonColor: "#c46a80",
      cancelButtonColor: "#1a2240",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectMutation.mutate({ id: reg._id, campId: reg.campId, isPaid });
        Swal.fire({
          title: "Registration Rejected",
          text: "The seat has been freed up.",
          icon: "info",
          background: "#10152A",
          color: "#f0f4ff",
          confirmButtonColor: "#1688A0",
        });
      }
    });
  };

  // ── filter + search
  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.participantName?.toLowerCase().includes(search.toLowerCase()) ||
      r.participantEmail?.toLowerCase().includes(search.toLowerCase()) ||
      r.campName?.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all" ||
      (tab === "pending"   && r.status === "pending") ||
      (tab === "confirmed" && r.status === "confirmed") ||
      (tab === "cancelled" && r.status === "cancelled");
    return matchSearch && matchTab;
  });

  // ── stats
  const total     = registrations.length;
  const pending   = registrations.filter((r) => r.status === "pending").length;
  const confirmed = registrations.filter((r) => r.status === "confirmed").length;
  const cancelled = registrations.filter((r) => r.status === "cancelled").length;

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  if (isLoading) return (
    <div className="mr__loading">
      <div className="mr__spinner" />
      <span>Loading registrations...</span>
    </div>
  );

  return (
    <div className="mr">

      {/* header */}
      <div className="mr__header">
        <div className="mr__tag">
          <span className="mr__tag-line" />
          <span className="mr__tag-text">Organizer Panel</span>
        </div>
        <h1 className="mr__title">Manage Registered</h1>
        <p className="mr__sub">Review and confirm participant registrations for your camps.</p>
      </div>

      {/* stats */}
      <div className="mr__stats">
        <div className="mr__stat">
          <div className="mr__stat-num">{total}</div>
          <div className="mr__stat-label">Total Registrations</div>
        </div>
        <div className="mr__stat mr__stat--amber">
          <div className="mr__stat-num">{pending}</div>
          <div className="mr__stat-label">Pending</div>
        </div>
        <div className="mr__stat mr__stat--green">
          <div className="mr__stat-num">{confirmed}</div>
          <div className="mr__stat-label">Confirmed</div>
        </div>
        <div className="mr__stat mr__stat--rose">
          <div className="mr__stat-num">{cancelled}</div>
          <div className="mr__stat-label">Cancelled</div>
        </div>
      </div>

      {/* tabs */}
      <div className="mr__tabs">
        {["all", "pending", "confirmed", "cancelled"].map((t) => (
          <button
            key={t}
            className={`mr__tab ${tab === t ? "mr__tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "pending" && pending > 0 && (
              <span className="mr__tab-badge">{pending}</span>
            )}
          </button>
        ))}
      </div>

      {/* toolbar */}
      <div className="mr__toolbar">
        <div className="mr__search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by participant or camp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="mr__count">{filtered.length} Records</span>
      </div>

      {/* table */}
      <div className="mr__card">
        {filtered.length === 0 ? (
          <div className="mr__empty">
            <div className="mr__empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(240,244,255,0.2)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div className="mr__empty-title">No Registrations Found</div>
            <p className="mr__empty-sub">Participants who join your camps will appear here.</p>
          </div>
        ) : (
          <table className="mr__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Participant</th>
                <th>Camp</th>
                <th>Joined</th>
                <th>Fees</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, idx) => {
                const isPending   = reg.status === "pending";
                const isConfirmed = reg.status === "confirmed";
                const isCancelled = reg.status === "cancelled";
                const isPaid      = reg.paymentStatus === "paid";
                const isFree      = reg.paymentStatus === "free" || reg.fees === 0 || reg.fees === "0";

                return (
                  <tr key={reg._id} className={isCancelled ? "mr__row--cancelled" : ""}>
                    <td className="mr__num">{String(idx + 1).padStart(2, "0")}</td>

                    <td>
                      <div className="mr__p-cell">
                        <div className="mr__avatar">
                          {reg.participantName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="mr__p-name">{reg.participantName}</div>
                          <div className="mr__p-email">{reg.participantEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="mr__camp-name">{reg.campName}</div>
                      <div className="mr__camp-loc">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                        {reg.location}
                      </div>
                    </td>

                    <td>
                      <div className="mr__date">{formatDate(reg.joinedAt)}</div>
                    </td>

                    <td>
                      <span className={`mr__fees ${isFree ? "mr__fees--free" : ""}`}>
                        {isFree ? "Free" : `$${reg.fees}`}
                      </span>
                    </td>

                    <td>
                      {isFree   && <span className="mr__badge mr__badge--free"><span className="mr__bdot"/>Free</span>}
                      {isPaid   && <span className="mr__badge mr__badge--paid"><span className="mr__bdot"/>Paid</span>}
                      {!isFree && !isPaid && <span className="mr__badge mr__badge--unpaid"><span className="mr__bdot"/>Unpaid</span>}
                    </td>

                    <td>
                      {isPending   && <span className="mr__badge mr__badge--pending"><span className="mr__bdot"/>Pending</span>}
                      {isConfirmed && <span className="mr__badge mr__badge--confirmed"><span className="mr__bdot"/>Confirmed</span>}
                      {isCancelled && <span className="mr__badge mr__badge--cancelled"><span className="mr__bdot"/>Cancelled</span>}
                    </td>

                    <td>
                      <div className="mr__actions">
                        <button
                          className="mr__btn mr__btn--view"
                          onClick={() => setSelectedReg(reg)}
                        >
                          View
                        </button>
                        {isPending && (
                          <>
                            <button
                              className="mr__btn mr__btn--confirm"
                              onClick={() => handleConfirm(reg)}
                              disabled={confirmMutation.isPending}
                            >
                              Confirm
                            </button>
                            <button
                              className="mr__btn mr__btn--reject"
                              onClick={() => handleReject(reg)}
                              disabled={rejectMutation.isPending}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {isCancelled && (
                          <button className="mr__btn mr__btn--disabled" disabled>
                            Cancelled
                          </button>
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

      {/* detail modal */}
      {selectedReg && (
        <div
          className="mr__modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelectedReg(null)}
        >
          <div className="mr__modal">
            <button className="mr__modal-close" onClick={() => setSelectedReg(null)}>×</button>
            <div className="mr__modal-title">Participant Details</div>
            <p className="mr__modal-sub">Registration info for this participant</p>

            <div className="mr__detail-grid">
              <div className="mr__detail-item">
                <div className="mr__detail-label">Participant Name</div>
                <div className="mr__detail-val">{selectedReg.participantName}</div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Email</div>
                <div className="mr__detail-val">{selectedReg.participantEmail}</div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Camp Name</div>
                <div className="mr__detail-val">{selectedReg.campName}</div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Location</div>
                <div className="mr__detail-val">{selectedReg.location}</div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Fees</div>
                <div className="mr__detail-val">
                  {selectedReg.fees === 0 || selectedReg.fees === "0" || selectedReg.paymentStatus === "free"
                    ? "Free"
                    : `$${selectedReg.fees}`}
                </div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Payment Status</div>
                <div className="mr__detail-val">
                  <span className={`mr__badge mr__badge--${selectedReg.paymentStatus}`}>
                    <span className="mr__bdot"/>
                    {selectedReg.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Joined On</div>
                <div className="mr__detail-val">{formatDate(selectedReg.joinedAt)}</div>
              </div>
              <div className="mr__detail-item">
                <div className="mr__detail-label">Status</div>
                <div className="mr__detail-val">
                  <span className={`mr__badge mr__badge--${selectedReg.status}`}>
                    <span className="mr__bdot"/>
                    {selectedReg.status}
                  </span>
                </div>
              </div>
              {selectedReg.paymentIntentId && (
                <div className="mr__detail-item mr__detail-item--full">
                  <div className="mr__detail-label">Transaction ID</div>
                  <div className="mr__detail-val mr__detail-val--mono">{selectedReg.paymentIntentId}</div>
                </div>
              )}
            </div>

            <div className="mr__modal-footer">
              <button className="mr__btn-ghost" onClick={() => setSelectedReg(null)}>Close</button>
              {selectedReg.status === "pending" && (
                <>
                  <button
                    className="mr__btn-reject-modal"
                    onClick={() => { handleReject(selectedReg); }}
                  >
                    Reject
                  </button>
                  <button
                    className="mr__btn-confirm-modal"
                    onClick={() => { handleConfirm(selectedReg); setSelectedReg(null); }}
                  >
                    Confirm Registration
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageRegistered;