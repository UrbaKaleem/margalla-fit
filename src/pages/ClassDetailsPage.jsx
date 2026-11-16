import { Link, useLocation, useParams } from "react-router-dom";
import { useClasses } from "../context/ClassesContext.jsx";
import LoadGate from "../components/LoadGate.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ClassImage from "../components/ClassImage.jsx";
import { AvailabilityBadge, LevelBadge } from "../components/Badges.jsx";
import { formatPKR, formatTime } from "../utils/classHelpers.js";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { byId } = useClasses();
  const record = byId[id];
  // Return to the same filtered list the user came from (if any).
  const backTo = `/classes${location.state?.fromSearch ?? ""}`;

  return (
    <LoadGate>
      <p><Link to={backTo} className="back-link">← Back to classes</Link></p>
      {!record ? (
        <EmptyState
          title="Class not found"
          action={<Link className="btn btn--primary" to="/classes">See all classes</Link>}
        >
          <p>
            We couldn&apos;t find a class with the code <code>{id}</code>. It may have been removed from this
            week&apos;s timetable or the link may be mistyped.
          </p>
        </EmptyState>
      ) : (
        <article className="details">
          <ClassImage record={record} className="details__image" />
          <div className="details__info">
            <div className="class-card__badges">
              <LevelBadge level={record.level} />
              <AvailabilityBadge record={record} />
            </div>
            <h1>{record.title}</h1>
            <p className="details__desc">{record.description}</p>
            <dl className="facts">
              <div><dt>When</dt><dd>{record.day} at {formatTime(record.time)}</dd></div>
              <div><dt>Duration</dt><dd>{record.durationMin} minutes</dd></div>
              <div><dt>Instructor</dt><dd>{record.instructor}</dd></div>
              <div><dt>Room</dt><dd>{record.room}</dd></div>
              <div><dt>Drop-in price</dt><dd>{formatPKR(record.price)} per person</dd></div>
              <div><dt>What to bring</dt><dd>{record.bring || "Nothing special – just comfortable clothes."}</dd></div>
            </dl>
          </div>
        </article>
      )}
    </LoadGate>
  );
}
