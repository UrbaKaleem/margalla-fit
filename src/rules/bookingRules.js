// Margalla Fit operating rules.
// Pure functions with no React or browser dependencies, so the SAME code is
// used by the app and by the Node test (tests/bookingRules.test.js).

/* ---------------------------------------------------------------
 * Rule 1 – Availability / capacity
 * One booking may include 1 to 3 people per session (you + 2 friends),
 * and never more people than the seats left in that session.
 * ------------------------------------------------------------- */
export const MIN_ATTENDEES = 1;
export const MAX_ATTENDEES_PER_SESSION = 3;

/**
 * @param {number} attendees  number of people requested for one session
 * @param {number} seatsLeft  seats still free in that session
 * @returns {{ok: boolean, code: string, max: number, message: string}}
 */
export function checkAttendees(attendees, seatsLeft) {
  const max = Math.max(0, Math.min(MAX_ATTENDEES_PER_SESSION, seatsLeft));

  if (seatsLeft <= 0) {
    return { ok: false, code: "full", max, message: "This session is full. Remove it or choose another class." };
  }
  if (!Number.isInteger(attendees) || attendees < MIN_ATTENDEES) {
    return { ok: false, code: "too-few", max, message: `Choose at least ${MIN_ATTENDEES} person.` };
  }
  if (attendees > MAX_ATTENDEES_PER_SESSION) {
    return {
      ok: false,
      code: "over-limit",
      max,
      message: `You can book up to ${MAX_ATTENDEES_PER_SESSION} people per session.`,
    };
  }
  if (attendees > seatsLeft) {
    return {
      ok: false,
      code: "over-capacity",
      max,
      message: `Only ${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left in this session.`,
    };
  }
  return { ok: true, code: "ok", max, message: "" };
}

/* ---------------------------------------------------------------
 * Rule 2 – Eligibility
 * Advanced classes require "intermediate" or "advanced" experience,
 * declared in the booking form.
 * ------------------------------------------------------------- */
export const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner – less than 6 months of regular training" },
  { value: "intermediate", label: "Intermediate – 6 months to 2 years" },
  { value: "advanced", label: "Advanced – more than 2 years" },
];

/**
 * @param {string} classLevel  "Beginner" | "Intermediate" | "Advanced"
 * @param {string} experience  "" | "beginner" | "intermediate" | "advanced"
 */
export function checkEligibility(classLevel, experience) {
  if (classLevel !== "Advanced") return { ok: true, message: "" };
  if (experience === "intermediate" || experience === "advanced") return { ok: true, message: "" };
  return {
    ok: false,
    message: "Advanced classes need at least 6 months of regular training (Intermediate or Advanced experience).",
  };
}

/* ---------------------------------------------------------------
 * Rule 3 – Pricing
 * Members get 20% off. Drop-in (non-member) bookings pay a Rs 300
 * booking fee, waived when the subtotal is Rs 6,000 or more.
 * ------------------------------------------------------------- */
export const MEMBER_DISCOUNT_RATE = 0.2;
export const BOOKING_FEE = 300;
export const FEE_WAIVER_THRESHOLD = 6000;

/** @param {"member"|"dropin"|""} membership */
export function calculateBookingFee(subtotal, membership) {
  if (membership === "member") return 0;
  return subtotal >= FEE_WAIVER_THRESHOLD ? 0 : BOOKING_FEE;
}

/**
 * Calculates the booking summary from plan lines.
 * @param {Array<{price: number, attendees: number, durationMin: number}>} lines
 * @param {"member"|"dropin"|""} membership  ("" is treated as drop-in for estimates)
 */
export function calculateSummary(lines, membership) {
  const subtotal = lines.reduce((sum, { price, attendees }) => sum + price * attendees, 0);
  const discount = membership === "member" ? Math.round(subtotal * MEMBER_DISCOUNT_RATE) : 0;
  const bookingFee = lines.length === 0 ? 0 : calculateBookingFee(subtotal, membership);

  return {
    sessionCount: lines.length,
    attendeeCount: lines.reduce((sum, { attendees }) => sum + attendees, 0),
    totalMinutes: lines.reduce((sum, { durationMin }) => sum + durationMin, 0),
    subtotal,
    discount,
    bookingFee,
    total: subtotal - discount + bookingFee,
    amountToWaiveFee: membership === "member" || bookingFee === 0 ? 0 : FEE_WAIVER_THRESHOLD - subtotal,
  };
}
