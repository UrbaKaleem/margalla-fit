// Combines saved plan items with the CURRENT timetable data and rules.
// Because issues are derived (never stored), a restored plan is always
// re-checked against today's availability.
import { checkAttendees } from "../rules/bookingRules.js";
import { seatsLeft } from "./classHelpers.js";

/**
 * @returns {Array<{classId, attendees, record, check, issue}>}
 *   issue: null when the line is bookable, otherwise { code, message }
 */
export function getPlanLines(items, byId) {
  return items.map(({ classId, attendees }) => {
    const record = byId[classId] ?? null;
    if (!record) {
      return {
        classId,
        attendees,
        record: null,
        check: null,
        issue: { code: "missing", message: "This class is no longer on the timetable (it may have been cancelled)." },
      };
    }
    const check = checkAttendees(attendees, seatsLeft(record));
    return { classId, attendees, record, check, issue: check.ok ? null : { code: check.code, message: check.message } };
  });
}

/** Lines in the shape calculateSummary() expects, using only bookable lines. */
export function toSummaryLines(planLines) {
  return planLines
    .filter((line) => line.record && !line.issue)
    .map(({ record, attendees }) => ({ price: record.price, attendees, durationMin: record.durationMin }));
}
