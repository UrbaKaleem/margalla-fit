import { Link, useLocation } from "react-router-dom";
import usePlanLines from "../hooks/usePlanLines.js";
import { formatPKR } from "../utils/classHelpers.js";

/**
 * Mobile-only sticky bar (CSS shows it below 640px) so the plan total and the
 * next step stay reachable while scrolling a long class list.
 */
export default function PlanBar() {
  const { pathname } = useLocation();
  const { lines, summary, issues } = usePlanLines();

  if (!pathname.startsWith("/classes") || lines.length === 0) return null;

  return (
    <div className="plan-bar" aria-label="Your plan">
      <p>
        <strong>{lines.length} session{lines.length === 1 ? "" : "s"}</strong> · est. {formatPKR(summary.total)}
        {issues.length > 0 && " · needs attention"}
      </p>
      <Link className="btn btn--primary btn--small" to="/plan">View plan</Link>
    </div>
  );
}
