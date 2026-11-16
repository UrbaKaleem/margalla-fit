import { useState } from "react";
import { Link } from "react-router-dom";
import AttendeeStepper from "./AttendeeStepper.jsx";
import { checkAttendees } from "../rules/bookingRules.js";
import { formatPKR, seatsLeft } from "../utils/classHelpers.js";

/**
 * Add / update / remove one class in the plan from the details page.
 * Local state holds the number of people until the user confirms.
 */
export default function SelectionPanel({ record, planItem, onSave, onRemove }) {
  const [attendees, setAttendees] = useState(planItem?.attendees ?? 1);
  const left = seatsLeft(record);
  const check = checkAttendees(attendees, left);

  if (left === 0 && !planItem) {
    return (
      <div className="selection-panel selection-panel--unavailable">
        <p className="status status--error"><strong>Fully booked.</strong> This session has no seats left this week.</p>
        <Link className="btn btn--secondary" to={`/classes?type=${record.type}&available=1`}>
          See other {record.type} classes with seats
        </Link>
      </div>
    );
  }

  return (
    <div className="selection-panel">
      <AttendeeStepper id="attendees" value={attendees} max={Math.max(1, check.max)} onChange={setAttendees} />
      {!check.ok && <p className="status status--error" role="alert">{check.message}</p>}
      <p className="selection-panel__line">
        {attendees} × {formatPKR(record.price)} = <strong>{formatPKR(attendees * record.price)}</strong>
      </p>
      <div className="selection-panel__actions">
        <button
          type="button"
          className="btn btn--primary"
          disabled={!check.ok || planItem?.attendees === attendees}
          onClick={() => onSave(record.id, attendees)}
        >
          {planItem ? "Update plan" : "Add to plan"}
        </button>
        {planItem && (
          <>
            <button type="button" className="btn btn--secondary" onClick={() => onRemove(record.id)}>
              Remove from plan
            </button>
            <Link className="btn btn--link" to="/plan">Review plan →</Link>
          </>
        )}
      </div>
      {planItem && (
        <p className="status status--success" role="status">
          ✓ In your plan for {planItem.attendees} {planItem.attendees === 1 ? "person" : "people"}.
        </p>
      )}
    </div>
  );
}
