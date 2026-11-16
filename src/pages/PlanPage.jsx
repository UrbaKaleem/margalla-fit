import { Link } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import LoadGate from "../components/LoadGate.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SummaryPanel from "../components/SummaryPanel.jsx";
import PlanLine from "../components/PlanLine.jsx";
import usePlanLines from "../hooks/usePlanLines.js";

export default function PlanPage() {
  const { updateAttendees, removeFromPlan, clearPlan } = usePlan();
  const { lines, issues, summary, membership } = usePlanLines();

  return (
    <>
      <h1>Your weekly plan</h1>
      <LoadGate>
        {lines.length === 0 ? (
          <EmptyState
            title="Your plan is empty"
            action={<Link className="btn btn--primary" to="/classes">Browse classes</Link>}
          >
            <p>Add classes from the timetable and they&apos;ll appear here. Your plan is saved on this device.</p>
          </EmptyState>
        ) : (
          <div className="two-col">
            <section aria-labelledby="sessions-heading">
              <h2 id="sessions-heading" className="visually-hidden">Planned sessions</h2>
              {issues.length > 0 && (
                <div className="banner banner--error" role="alert">
                  <strong>
                    {issues.length} session{issues.length === 1 ? " needs" : "s need"} your attention.
                  </strong>{" "}
                  The timetable has changed since you added {issues.length === 1 ? "it" : "them"}. Fix or remove the
                  highlighted sessions to continue.
                </div>
              )}
              <ul className="plan-list">
                {lines.map((line) => (
                  <li key={line.classId}>
                    <PlanLine line={line} onChangeAttendees={updateAttendees} onRemove={removeFromPlan} />
                  </li>
                ))}
              </ul>
              <div className="plan-actions">
                <Link to="/classes" className="btn btn--secondary">+ Add more classes</Link>
                <button type="button" className="btn btn--link" onClick={clearPlan}>Clear plan</button>
              </div>
            </section>

            <SummaryPanel summary={summary} membership={membership} title="Estimated total">
              {issues.length > 0 ? (
                <>
                  <button type="button" className="btn btn--primary btn--block" disabled aria-describedby="checkout-blocked">
                    Continue to your details
                  </button>
                  <p id="checkout-blocked" className="status status--error">Fix the highlighted sessions first.</p>
                </>
              ) : (
                <Link className="btn btn--primary btn--block" to="/checkout">Continue to your details</Link>
              )}
            </SummaryPanel>
          </div>
        )}
      </LoadGate>
    </>
  );
}
