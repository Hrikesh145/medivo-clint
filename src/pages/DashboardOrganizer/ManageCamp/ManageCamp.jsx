import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import "./ManageCamp.css";

const formatDate = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ManageCamp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // fetch organizer's camps
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["organizer-camps", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/camps?organizerEmail=${user?.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  // delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/camps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["organizer-camps"]);
      toast.success("Camp deleted");
    },
    onError: () => toast.error("Failed to delete camp"),
  });

  const handleDelete = (camp) => {
    Swal.fire({
      title: "Delete Camp?",
      text: `"${camp.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      background: "#10152A",
      color: "#F0F4FF",
      confirmButtonColor: "#9E4A60",
      cancelButtonColor: "#1688A0",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(camp._id);
      }
    });
  };

  // filtered camps
  const filtered = useMemo(() => {
    if (!search.trim()) return camps;
    const q = search.toLowerCase();
    return camps.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
    );
  }, [camps, search]);

  // stats
  const totalParticipants = camps.reduce(
    (sum, c) => sum + (c.participantCount || 0),
    0
  );
  const fullCamps = camps.filter(
    (c) => c.participantCount >= c.maxParticipants
  ).length;
  const activeCamps = camps.length - fullCamps;

  return (
    <div className="mc">
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

      {/* header */}
      <div className="mc__header">
        <div className="mc__tag">
          <span className="mc__tag-line" />
          <span className="mc__tag-text">Organizer Panel</span>
        </div>
        <h1 className="mc__title">Manage Camps</h1>
        <p className="mc__subtitle">
          View, edit, and delete your published medical camps.
        </p>
      </div>

      {/* stats */}
      <div className="mc__stats">
        <div className="mc__stat">
          <div className="mc__stat-num">{camps.length}</div>
          <div className="mc__stat-label">Total Camps</div>
        </div>
        <div className="mc__stat">
          <div className="mc__stat-num mc__stat-num--teal">
            {totalParticipants}
          </div>
          <div className="mc__stat-label">Total Participants</div>
        </div>
        <div className="mc__stat">
          <div className="mc__stat-num">{activeCamps}</div>
          <div className="mc__stat-label">Active Camps</div>
        </div>
        <div className="mc__stat">
          <div className="mc__stat-num">{fullCamps}</div>
          <div className="mc__stat-label">Full Camps</div>
        </div>
      </div>

      {/* table card */}
      <div className="mc__card">

        {/* toolbar */}
        <div className="mc__toolbar">
          <div className="mc__search-wrap">
            <svg
              className="mc__search-icon"
              width="14" height="14"
              viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="mc__search-input"
              placeholder="Search camps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="mc__total">{filtered.length} Camps</span>
        </div>

        {/* table */}
        {isLoading ? (
          <div className="mc__loading">Loading camps...</div>
        ) : filtered.length === 0 ? (
          <div className="mc__empty">
            <div className="mc__empty-title">No camps found</div>
            <div className="mc__empty-sub">
              {search ? "Try a different search term" : "Add your first camp to get started"}
            </div>
          </div>
        ) : (
          <div className="mc__table-wrap">
            <table className="mc__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Camp</th>
                  <th>Duration</th>
                  <th>Fees</th>
                  <th>Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((camp, index) => {
                  const isFull =
                    camp.participantCount >= camp.maxParticipants;
                  const pct = camp.maxParticipants
                    ? Math.min(
                        (camp.participantCount / camp.maxParticipants) * 100,
                        100
                      )
                    : 0;

                  return (
                    <tr key={camp._id}>
                      {/* index */}
                      <td
                        style={{
                          color: "rgba(240,244,255,0.18)",
                          fontSize: "12px",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* camp */}
                      <td>
                        <div className="mc__camp-cell">
                          {camp.image ? (
                            <img
                              src={camp.image}
                              alt={camp.name}
                              className="mc__camp-thumb"
                            />
                          ) : (
                            <div className="mc__camp-thumb-placeholder">
                              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                                <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="rgba(94,200,224,0.35)" />
                                <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="rgba(94,200,224,0.35)" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="mc__camp-name">{camp.name}</div>
                            <div className="mc__camp-location">
                              {camp.location}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* duration */}
                      <td>
                        <div className="mc__date-range">
                          <span className="mc__date-main">
                            {formatDate(camp.startDateTime)} —{" "}
                            {formatDate(camp.endDateTime)}
                          </span>
                          <span className="mc__date-time">
                            {formatTime(camp.startDateTime)} →{" "}
                            {formatTime(camp.endDateTime)}
                          </span>
                        </div>
                      </td>

                      {/* fees */}
                      <td>
                        {camp.fees === 0 ? (
                          <span className="mc__fees-free">Free</span>
                        ) : (
                          <span className="mc__fees-paid">${camp.fees}</span>
                        )}
                      </td>

                      {/* participants */}
                      <td>
                        <div className="mc__participants">
                          <span className="mc__participants-text">
                            <span>{camp.participantCount}</span> /{" "}
                            {camp.maxParticipants}
                          </span>
                          <div className="mc__progress">
                            <div
                              className={`mc__progress-fill ${isFull ? "mc__progress-fill--full" : ""}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* status */}
                      <td>
                        <span
                          className={`mc__badge ${isFull ? "mc__badge--full" : "mc__badge--active"}`}
                        >
                          <span className="mc__badge-dot" />
                          {isFull ? "Full" : "Active"}
                        </span>
                      </td>

                      {/* actions */}
                      <td>
                        <div className="mc__actions">
                          <Link
                            to={`/dashboard/update-camp/${camp._id}`}
                            className="mc__btn-edit"
                          >
                            Edit
                          </Link>
                          <button
                            className="mc__btn-delete"
                            onClick={() => handleDelete(camp)}
                            disabled={deleteMutation.isPending}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCamp;