import { Link } from "react-router-dom";
import AttendeeStepper from "./AttendeeStepper.jsx";
import { formatPKR, formatTime } from "../utils/classHelpers.js";

/**
 * One planned session. If the current timetable makes it invalid
 * (removed, full, fewer seats), explains the conflict and offers a fix.
 */
export default function PlanLine({ line, onChangeAttendees, onRemove }) {
  const { classId, attendees, record, check, issue } = line;

  if (!record) {
    return (
      <article className="plan-line has-issue">
        <div className="plan-line__main">
          <h3>Unavailable class</h3>
          <p className="status status--error">{issue.message}</p>
        </div>
        <button type="button" className="btn btn--secondary" onClick={() => onRemove(classId)}>
          Remove
        </button>
      </article>
    );
  }

  const canReduce = issue && check.max > 0;

  return (
    <article className={`plan-line ${issue ? "has-issue" : ""}`}>
      <div className="plan-line__main">
        <h3>
          <Link to={`/classes/${record.id}`}>{record.title}</Link>
        </h3>
        <p className="muted">
          {record.day} · {formatTime(record.time)} · {record.durationMin} min · {formatPKR(record.price)} per person
        </p>
        {issue && (
          <p className="status status--error">
            <strong>Problem:</strong> {issue.message}
          </p>
        )}
      </div>
      <div className="plan-line__controls">
        {canReduce ? (
          <button type="button" className="btn btn--primary btn--small" onClick={() => onChangeAttendees(classId, check.max)}>
            Reduce to {check.max} {check.max === 1 ? "person" : "people"}
          </button>
        ) : (
          !issue && (
            <AttendeeStepper
              id={`att-${classId}`}
              value={attendees}
              max={check.max}
              onChange={(value) => onChangeAttendees(classId, value)}
            />
          )
        )}
        <p className="plan-line__price">{issue ? "—" : formatPKR(record.price * attendees)}</p>
        <button type="button" className="btn btn--link" onClick={() => onRemove(classId)}>
          Remove<span className="visually-hidden"> {record.title}</span>
        </button>
      </div>
    </article>
  );
}
