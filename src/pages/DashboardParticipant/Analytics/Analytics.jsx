import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Legend,
} from "recharts";
import "./Analytics.css";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// ── custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="an__tooltip">
      {label && <div className="an__tooltip-label">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="an__tooltip-row">
          <span className="an__tooltip-dot" style={{ background: p.color }} />
          <span className="an__tooltip-name">{p.name}:</span>
          <span className="an__tooltip-val">
            {p.name === "Spent" ? `$${p.value}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ── fetch registrations
  const { data: registrations = [], isLoading: regLoading } = useQuery({
    queryKey: ["participant-registrations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations?participantEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ── fetch payments
  const { data: payments = [], isLoading: payLoading } = useQuery({
    queryKey: ["participant-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?participantEmail=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isLoading = regLoading || payLoading;

  // ── derived stats
  const stats = useMemo(() => {
    const total      = registrations.length;
    const confirmed  = registrations.filter((r) => r.status === "confirmed").length;
    const pending    = registrations.filter((r) => r.status === "pending").length;
    const cancelled  = registrations.filter((r) => r.status === "cancelled").length;
    const paid       = registrations.filter((r) => r.paymentStatus === "paid").length;
    const totalSpent = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return { total, confirmed, pending, cancelled, paid, totalSpent };
  }, [registrations, payments]);

  // ── bar chart: registrations per camp
  const campBarData = useMemo(() => {
    const map = {};
    registrations.forEach((r) => {
      const key = r.campName?.length > 18 ? r.campName.slice(0, 16) + "…" : r.campName;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([camp, count]) => ({ camp, count }));
  }, [registrations]);

  // ── line chart: spending over time (by month)
  const spendingLineData = useMemo(() => {
    const map = {};
    payments.forEach((p) => {
      const date = new Date(p.paidAt);
      const key  = date.toLocaleString("default", { month: "short", year: "2-digit" });
      map[key] = (map[key] || 0) + (Number(p.amount) || 0);
    });
    return Object.entries(map).map(([month, Spent]) => ({ month, Spent }));
  }, [payments]);

  // ── pie chart: registration status breakdown
  const pieData = useMemo(() => {
    const d = [
      { name: "Confirmed", value: stats.confirmed, fill: "#5ed4a0" },
      { name: "Pending",   value: stats.pending,   fill: "#f0b432" },
      { name: "Cancelled", value: stats.cancelled,  fill: "#c46a80" },
    ].filter((d) => d.value > 0);
    return d.length ? d : [{ name: "No Data", value: 1, fill: "rgba(240,244,255,0.06)" }];
  }, [stats]);

  // ── payment status pie
  const payPieData = useMemo(() => [
    { name: "Paid",   value: stats.paid,                         fill: "#a06ee0" },
    { name: "Unpaid", value: stats.total - stats.paid - (registrations.filter(r=>r.paymentStatus==="free").length), fill: "#c46a80" },
    { name: "Free",   value: registrations.filter(r=>r.paymentStatus==="free").length, fill: "#22AACC" },
  ].filter((d) => d.value > 0), [stats, registrations]);

  if (isLoading) return (
    <div className="an__loading">
      <div className="an__spinner" />
      <span>Loading analytics...</span>
    </div>
  );

  return (
    <div className="an">

      {/* ── header */}
      <div className="an__header">
        <div className="an__tag">
          <span className="an__tag-line" />
          <span className="an__tag-text">Participant Panel</span>
        </div>
        <h1 className="an__title">Analytics</h1>
        <p className="an__sub">A visual overview of your camp activity and spending.</p>
      </div>

      {/* ── stat strip */}
      <div className="an__stats">
        {[
          { label: "Total Joined",  value: stats.total,                  color: "default" },
          { label: "Confirmed",     value: stats.confirmed,              color: "green"   },
          { label: "Pending",       value: stats.pending,                color: "amber"   },
          { label: "Cancelled",     value: stats.cancelled,              color: "rose"    },
          { label: "Total Spent",   value: `$${stats.totalSpent.toFixed(2)}`, color: "purple" },
          { label: "Paid Camps",    value: stats.paid,                   color: "purple"  },
        ].map((s) => (
          <div key={s.label} className={`an__stat an__stat--${s.color}`}>
            <div className="an__stat-num">{s.value}</div>
            <div className="an__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── charts row 1: bar + line */}
      <div className="an__row">

        {/* bar: camps joined */}
        <div className="an__chart-card an__chart-card--wide">
          <div className="an__chart-glow an__chart-glow--purple" />
          <div className="an__chart-head">
            <div className="an__chart-title">Camps Joined</div>
            <div className="an__chart-sub">Registration count per camp</div>
          </div>
          {campBarData.length === 0 ? (
            <div className="an__empty">No registrations yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campBarData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,244,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="camp"
                  tick={{ fill: "rgba(240,244,255,0.3)", fontSize: 10, fontFamily: "Geologica" }}
                  angle={-35} textAnchor="end" interval={0}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "rgba(240,244,255,0.3)", fontSize: 10, fontFamily: "Geologica" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(160,110,224,0.05)" }} />
                <Bar dataKey="count" name="Registrations" radius={[6, 6, 0, 0]}
                  fill="url(#barGradient)" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a06ee0" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6030a0" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* line: spending over time */}
        <div className="an__chart-card">
          <div className="an__chart-glow an__chart-glow--teal" />
          <div className="an__chart-head">
            <div className="an__chart-title">Spending Over Time</div>
            <div className="an__chart-sub">Monthly payment history</div>
          </div>
          {spendingLineData.length === 0 ? (
            <div className="an__empty">No payment history yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={spendingLineData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(240,244,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "rgba(240,244,255,0.3)", fontSize: 10, fontFamily: "Geologica" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(240,244,255,0.3)", fontSize: 10, fontFamily: "Geologica" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(34,170,204,0.2)" }} />
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22AACC" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#22AACC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone" dataKey="Spent" name="Spent"
                  stroke="#22AACC" strokeWidth={2}
                  dot={{ r: 4, fill: "#22AACC", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#5EC8E0", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ── charts row 2: two pies */}
      <div className="an__row an__row--pies">

        {/* pie: registration status */}
        <div className="an__chart-card">
          <div className="an__chart-glow an__chart-glow--green" />
          <div className="an__chart-head">
            <div className="an__chart-title">Registration Status</div>
            <div className="an__chart-sub">Breakdown by current status</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData} cx="50%" cy="45%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
                stroke="transparent"
                isAnimationActive={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle" iconSize={8}
                formatter={(v) => (
                  <span style={{ fontSize: 11, color: "rgba(240,244,255,0.5)", fontFamily: "Geologica", letterSpacing: 1 }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* pie: payment status */}
        <div className="an__chart-card">
          <div className="an__chart-glow an__chart-glow--purple" />
          <div className="an__chart-head">
            <div className="an__chart-title">Payment Breakdown</div>
            <div className="an__chart-sub">Paid vs unpaid vs free camps</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={payPieData} cx="50%" cy="45%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value"
                stroke="transparent"
                isAnimationActive={true}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle" iconSize={8}
                formatter={(v) => (
                  <span style={{ fontSize: 11, color: "rgba(240,244,255,0.5)", fontFamily: "Geologica", letterSpacing: 1 }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* summary card */}
        <div className="an__chart-card an__summary">
          <div className="an__chart-glow an__chart-glow--teal" />
          <div className="an__chart-head">
            <div className="an__chart-title">Summary</div>
            <div className="an__chart-sub">Your activity at a glance</div>
          </div>
          <div className="an__summary-rows">
            {[
              { label: "Camps Registered",    val: stats.total,                         accent: "default" },
              { label: "Successfully Joined", val: stats.confirmed,                     accent: "green"   },
              { label: "Awaiting Confirm",    val: stats.pending,                       accent: "amber"   },
              { label: "Total Payments Made", val: payments.length,                     accent: "purple"  },
              { label: "Total Amount Spent",  val: `$${stats.totalSpent.toFixed(2)}`,   accent: "teal"    },
              { label: "Avg Per Camp",
                val: payments.length
                  ? `$${(stats.totalSpent / payments.length).toFixed(2)}`
                  : "$0.00",
                accent: "teal" },
            ].map((row) => (
              <div key={row.label} className="an__summary-row">
                <span className="an__summary-label">{row.label}</span>
                <span className={`an__summary-val an__summary-val--${row.accent}`}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;