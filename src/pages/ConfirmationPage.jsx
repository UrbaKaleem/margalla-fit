import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatPKR } from "../utils/classHelpers.js";

export default function ConfirmationPage() {
  const location = useLocation();
  const { lastBooking } = usePlan();
  // Fresh navigation passes the booking in route state; a refresh falls back to storage.
  const booking = location.state?.booking ?? lastBooking;
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus(); // announce the result to keyboard/screen-reader users
  }, []);

  if (!booking) {
    return (
      <EmptyState title="No booking to show" action={<Link className="btn btn--primary" to="/classes">Browse classes</Link>}>
        <p>You haven&apos;t confirmed a booking on this device yet.</p>
      </EmptyState>
    );
  }

  const { summary } = booking;
  return (
    <section className="confirmation">
      <p className="status status--success">✓ Booking confirmed (simulated – no payment taken)</p>
      <h1 ref={headingRef} tabIndex={-1}>Thanks, {booking.firstName}! You&apos;re booked in.</h1>
      <p className="confirmation__ref">Reference: <strong>{booking.reference}</strong></p>

      <h2>Your sessions</h2>
      <ul className="confirmation__list">
        {booking.sessions.map((session) => (
          <li key={session.id}>
            <strong>{session.title}</strong> – {session.when}, {session.room} · {session.attendees}{" "}
            {session.attendees === 1 ? "person" : "people"}
          </li>
        ))}
      </ul>

      <dl className="summary__rows">
        <div><dt>Subtotal</dt><dd>{formatPKR(summary.subtotal)}</dd></div>
        {summary.discount > 0 && <div><dt>Member discount</dt><dd>−{formatPKR(summary.discount)}</dd></div>}
        {booking.membership === "dropin" && <div><dt>Booking fee</dt><dd>{summary.bookingFee ? formatPKR(summary.bookingFee) : "Waived"}</dd></div>}
        <div className="summary__total"><dt>Pay at the front desk</dt><dd>{formatPKR(summary.total)}</dd></div>
      </dl>

      <h2>Before you come</h2>
      <ul>
        <li>Arrive 10 minutes early and show your reference at reception.</li>
        <li>Plot 12, F-7 Markaz, Islamabad (fictional address).</li>
      </ul>
      <Link className="btn btn--primary" to="/classes">Plan another week</Link>
    </section>
  );
}
