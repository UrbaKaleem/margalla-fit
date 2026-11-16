import { Link, useLocation } from "react-router-dom";
import ClassImage from "./ClassImage.jsx";
import { AvailabilityBadge, LevelBadge } from "./Badges.jsx";
import { formatPKR, formatTime } from "../utils/classHelpers.js";

/**
 * One class in the listing. Shows the information needed to compare
 * options (level, schedule, price, seats left) without opening details.
 */
export default function ClassCard({ record }) {
  const location = useLocation();

  return (
    <article className="class-card">
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
        <p className="class-card__price">
          <strong>{formatPKR(record.price)}</strong> <span className="muted">drop-in per person</span>
        </p>
      </div>
    </article>
  );
}
