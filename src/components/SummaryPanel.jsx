import { BOOKING_FEE, FEE_WAIVER_THRESHOLD, MEMBER_DISCOUNT_RATE } from "../rules/bookingRules.js";
import { formatPKR } from "../utils/classHelpers.js";

/** Calculated booking summary (Rule 3 pricing). All values are derived from props. */
export default function SummaryPanel({ summary, membership, title = "Summary", children }) {
  const hours = Math.floor(summary.totalMinutes / 60);
  const minutes = summary.totalMinutes % 60;

  return (
    <aside className="summary" aria-labelledby="summary-heading">
      <h2 id="summary-heading">{title}</h2>
      <dl className="summary__rows">
        <div><dt>Sessions</dt><dd>{summary.sessionCount}</dd></div>
        <div><dt>Places booked</dt><dd>{summary.attendeeCount}</dd></div>
        <div><dt>Training time</dt><dd>{hours ? `${hours} h ` : ""}{minutes} min</dd></div>
        <div><dt>Subtotal</dt><dd>{formatPKR(summary.subtotal)}</dd></div>
        {summary.discount > 0 && (
          <div className="summary__saving">
            <dt>Member discount ({MEMBER_DISCOUNT_RATE * 100}%)</dt>
            <dd>−{formatPKR(summary.discount)}</dd>
          </div>
        )}
        {membership !== "member" && summary.sessionCount > 0 && (
          <div>
            <dt>Drop-in booking fee</dt>
            <dd>{summary.bookingFee ? formatPKR(summary.bookingFee) : "Waived"}</dd>
          </div>
        )}
        <div className="summary__total"><dt>Total due at front desk</dt><dd>{formatPKR(summary.total)}</dd></div>
      </dl>
      {membership !== "member" && summary.sessionCount > 0 && (
        <p className="summary__note">
          {summary.bookingFee
            ? `Drop-in bookings pay a ${formatPKR(BOOKING_FEE)} fee, waived from ${formatPKR(FEE_WAIVER_THRESHOLD)}. Add ${formatPKR(summary.amountToWaiveFee)} more to waive it.`
            : `Booking fee waived – your subtotal is ${formatPKR(FEE_WAIVER_THRESHOLD)} or more.`}
          {!membership && " Members save 20% – choose “Member” at checkout."}
        </p>
      )}
      {children}
    </aside>
  );
}
