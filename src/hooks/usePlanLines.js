import { useMemo } from "react";
import { useClasses } from "../context/ClassesContext.jsx";
import { usePlan } from "../context/PlanContext.jsx";
import { calculateSummary } from "../rules/bookingRules.js";
import { getPlanLines, toSummaryLines } from "../utils/planHelpers.js";

/** Derived plan data shared by the plan page, checkout and the mobile plan bar. */
export default function usePlanLines() {
  const { byId } = useClasses();
  const { items, draft } = usePlan();

  const lines = useMemo(() => getPlanLines(items, byId), [items, byId]);
  const issues = lines.filter((line) => line.issue);
  const summary = useMemo(() => calculateSummary(toSummaryLines(lines), draft.membership), [lines, draft.membership]);

  return { lines, issues, summary, membership: draft.membership };
}
