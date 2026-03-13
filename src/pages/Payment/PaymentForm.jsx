import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import "./Payment.css";
const PaymentForm = () => {
  const { user } = useAuth();
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  // ── fetch the registration to get fee amount
  const { data: registration = null, isPending } = useQuery({
    queryKey: ["registration", registrationId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/registrations/${registrationId}`);
      return res.data;
    },
    enabled: !!registrationId,
  });

  if (isPending) return (
    <div className="pf__loading">
      <div className="pf__spinner" />
      <span>Loading payment details...</span>
    </div>
  );

  if (!registration) return (
    <div className="pf__loading">
      <span>Registration not found.</span>
    </div>
  );

  const amount = Number(registration.fees) || 0;
  const amountInCents = Math.round(amount * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setProcessing(false);
      return;
    }

    try {
      // Step 1 — create PaymentIntent on backend
      const intentRes = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
      });
      const clientSecret = intentRes.data.clientSecret;
      if (!clientSecret) throw new Error("No clientSecret returned from server");

      // Step 2 — confirm card payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Participant",
              email: user?.email || undefined,
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      // Step 3 — on success, save payment + update registration
      if (paymentIntent?.status === "succeeded") {
        // save payment record
        await axiosSecure.post("/payments", {
          registrationId,
          campId:          registration.campId,
          campName:        registration.campName,
          paymentIntentId: paymentIntent.id,
          participantEmail: user?.email,
          participantName:  user?.displayName,
          amount,
          paidAt: new Date().toISOString(),
        });

        // update registration paymentStatus → paid
        await axiosSecure.patch(`/registrations/${registrationId}/pay`, {
          paymentStatus:   "paid",
          paymentIntentId: paymentIntent.id,
        });

        setPaid(true);

        Swal.fire({
          title: "Payment Successful!",
          html: `<p style="color:rgba(240,244,255,0.5);font-size:13px;">Your payment of <strong style="color:#5EC8E0;">$${amount}</strong> for<br/><strong style="color:rgba(240,244,255,0.8);">${registration.campName}</strong> was successful.</p>`,
          icon: "success",
          background: "#10152A",
          color: "#f0f4ff",
          confirmButtonColor: "#1688A0",
          confirmButtonText: "View My Camps",
        }).then(() => {
          navigate("/dashboard/registered-camps");
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pf">
      {/* header */}
      <div className="pf__header">
        <div className="pf__tag">
          <span className="pf__tag-line" />
          <span className="pf__tag-text">Secure Payment</span>
        </div>
        <h1 className="pf__title">Complete Payment</h1>
        <p className="pf__sub">Your transaction is encrypted and secure.</p>
      </div>

      <div className="pf__layout">
        {/* order summary */}
        <div className="pf__summary">
          <div className="pf__summary-label">Order Summary</div>
          <div className="pf__summary-camp">{registration.campName}</div>
          <div className="pf__summary-loc">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            {registration.location}
          </div>
          <div className="pf__summary-divider" />
          <div className="pf__summary-row">
            <span>Camp Fee</span>
            <span>${amount}</span>
          </div>
          <div className="pf__summary-row pf__summary-row--total">
            <span>Total</span>
            <span className="pf__summary-total">${amount}</span>
          </div>
          <div className="pf__secure-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Powered by Stripe — 256-bit SSL encryption
          </div>
        </div>

        {/* payment form */}
        <div className="pf__form-card">
          <div className="pf__form-label">Card Details</div>
          <form onSubmit={handleSubmit}>
            <div className="pf__card-element-wrap">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "15px",
                      color: "rgba(240,244,255,0.8)",
                      fontFamily: "'Geologica', sans-serif",
                      fontWeight: "300",
                      letterSpacing: "0.5px",
                      "::placeholder": { color: "rgba(240,244,255,0.25)" },
                    },
                    invalid: { color: "#c46a80" },
                  },
                }}
              />
            </div>

            {error && <p className="pf__error">{error}</p>}

            <button
              type="submit"
              className="pf__pay-btn"
              disabled={!stripe || !elements || processing || paid}
            >
              {processing ? (
                <><span className="pf__btn-spinner" /> Processing...</>
              ) : paid ? (
                "✓ Paid"
              ) : (
                `Pay $${amount}`
              )}
            </button>

            <button
              type="button"
              className="pf__back-btn"
              onClick={() => navigate("/dashboard/registered-camps")}
            >
              ← Back to Registered Camps
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;