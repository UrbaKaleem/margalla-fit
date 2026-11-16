import { seatsLeft } from "../utils/classHelpers.js";

/** Seat availability shown with text + colour (never colour alone). */
export function AvailabilityBadge({ record }) {
  const left = seatsLeft(record);
  let tone = "ok";
  let text = `${left} of ${record.seatsTotal} seats left`;
  if (left === 0) {
    tone = "full";
    text = "Full – no seats left";
  } else if (left <= 3) {
    tone = "low";
    text = `Only ${left} seat${left === 1 ? "" : "s"} left`;
  }
  return <span className={`badge badge--${tone}`}>{text}</span>;
}

export function LevelBadge({ level }) {
  return <span className={`badge badge--level badge--${level.toLowerCase()}`}>{level}</span>;
}
