import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import "./PaymentHistory.css";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?participantEmail=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const filtered = payments.filter((p) =>
    p.campName?.toLowerCase().includes(search.toLowerCase()) ||
    p.paymentIntentId?.toLowerCase().includes(search.toLowerCase())
  );

  // stats
  const totalSpent = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalCount = payments.length;

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  if (isLoading) return (
    <div className="ph__loading">
      <div className="ph__spinner" />
      <span>Loading payment history...</span>
    </div>
  );

  return (
    <div className="ph">

      {/* header */}
      <div className="ph__header">
        <div className="ph__tag">
          <span className="ph__tag-line" />
          <span className="ph__tag-text">Participant Panel</span>
        </div>
        <h1 className="ph__title">Payment History</h1>
        <p className="ph__sub">All your transaction records in one place.</p>
      </div>

      {/* stats */}
      <div className="ph__stats">
        <div className="ph__stat">
          <div className="ph__stat-icon ph__stat-icon--teal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22AACC" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
          </div>
          <div>
            <div className="ph__stat-num">{totalCount}</div>
            <div className="ph__stat-label">Total Transactions</div>
          </div>
        </div>
        <div className="ph__stat">
          <div className="ph__stat-icon ph__stat-icon--green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5ed4a0" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div className="ph__stat-num ph__stat-num--green">${totalSpent}</div>
            <div className="ph__stat-label">Total Spent</div>
          </div>
        </div>
        <div className="ph__stat">
          <div className="ph__stat-icon ph__stat-icon--purple">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a06ee0" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div className="ph__stat-num">{totalCount}</div>
            <div className="ph__stat-label">Successful Payments</div>
          </div>
        </div>
      </div>

      {/* toolbar */}
      <div className="ph__toolbar">
        <div className="ph__search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            placeholder="Search by camp name or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="ph__count">{filtered.length} Records</span>
      </div>

      {/* table */}
      <div className="ph__card">
        {filtered.length === 0 ? (
          <div className="ph__empty">
            <div className="ph__empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(240,244,255,0.2)" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            </div>
            <div className="ph__empty-title">No Transactions Yet</div>
            <p className="ph__empty-sub">Your payment records will appear here after you pay for a camp.</p>
          </div>
        ) : (
          <table className="ph__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Camp</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment, idx) => (
                <tr key={payment._id}>
                  <td className="ph__num">{String(idx + 1).padStart(2, "0")}</td>

                  <td>
                    <div className="ph__camp-name">{payment.campName}</div>
                    <div className="ph__participant">{payment.participantName}</div>
                  </td>

                  <td>
                    <div className="ph__txn-id">{payment.paymentIntentId}</div>
                  </td>

                  <td>
                    <div className="ph__date">{formatDate(payment.paidAt)}</div>
                  </td>

                  <td>
                    <span className="ph__amount">${payment.amount}</span>
                  </td>

                  <td>
                    <span className="ph__badge ph__badge--paid">
                      <span className="ph__badge-dot" />
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default PaymentHistory;