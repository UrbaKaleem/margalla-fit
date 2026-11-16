import { MAX_ATTENDEES_PER_SESSION, MIN_ATTENDEES } from "../rules/bookingRules.js";

/**
 * Quantity control for people per session. The limit is shown right beside
 * the control (Rule 1), and buttons are disabled at the boundaries.
 */
export default function AttendeeStepper({ id, value, max, onChange, label = "People" }) {
  const hintId = `${id}-hint`;
  return (
    <div className="stepper">
      <span className="stepper__label" id={`${id}-label`}>{label}</span>
      <div className="stepper__controls" role="group" aria-labelledby={`${id}-label`} aria-describedby={hintId}>
        <button
          type="button"
          className="stepper__btn"
          aria-label="Remove one person"
          disabled={value <= MIN_ATTENDEES}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <output className="stepper__value" aria-live="polite">{value}</output>
        <button
          type="button"
          className="stepper__btn"
          aria-label="Add one person"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
      <span className="stepper__hint" id={hintId}>
        {MIN_ATTENDEES}–{MAX_ATTENDEES_PER_SESSION} people per session
        {max < MAX_ATTENDEES_PER_SESSION && max > 0 ? ` · only ${max} seat${max === 1 ? "" : "s"} left` : ""}
      </span>
    </div>
  );
}
