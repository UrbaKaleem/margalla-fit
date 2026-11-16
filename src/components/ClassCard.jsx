import { Link, useLocation } from "react-router-dom";
import ClassImage from "./ClassImage.jsx";
import { AvailabilityBadge, LevelBadge } from "./Badges.jsx";
import { formatPKR, formatTime, seatsLeft } from "../utils/classHelpers.js";

/**
 * One class in the listing. Shows the information needed to compare
 * options (level, schedule, price, seats left) without opening details.
 * Selection changes are sent up through the onAdd / onRemove callback props.
 */
export default function ClassCard({ record, planItem, onAdd, onRemove }) {
  const location = useLocation();
  const isFull = seatsLeft(record) === 0;
  const inPlan = Boolean(planItem);

  return (
    <article className={`class-card ${inPlan ? "is-selected" : ""} ${isFull ? "is-unavailable" : ""}`}>
      <ClassImage record={record} />
      <div className="class-card__body">
        <div className="class-card__badges">
          <LevelBadge level={record.level} />
          <AvailabilityBadge record={record} />
        </div>
        <h3 className="class-card__title">
          {/* Pass the current search so "Back to classes" restores the same filters */}
          <Link to={`/classes/${record.id}`} state={{ fromSearch: location.search }}>
            {record.title}
          </Link>
        </h3>
        <p className="class-card__meta">
          {record.day} · {formatTime(record.time)} · {record.durationMin} min · {record.instructor}
        </p>
        {record.level === "Advanced" && (
          <p className="class-card__note">Requires 6+ months&apos; training experience</p>
        )}
        <div className="class-card__footer">
          <p className="class-card__price">
            <strong>{formatPKR(record.price)}</strong> <span className="muted">per person</span>
          </p>
          {inPlan ? (
            <div className="class-card__selected">
              <span className="selected-label">
                ✓ In plan{planItem.attendees > 1 ? ` (${planItem.attendees} people)` : ""}
              </span>
              <button type="button" className="btn btn--link" onClick={() => onRemove(record.id)}>
                Remove<span className="visually-hidden"> {record.title}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--primary btn--small"
              disabled={isFull}
              onClick={() => onAdd(record.id)}
            >
              {isFull ? "Full" : "Add to plan"}
              <span className="visually-hidden"> {record.title}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
