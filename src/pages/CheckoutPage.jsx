import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";
import LoadGate from "../components/LoadGate.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SummaryPanel from "../components/SummaryPanel.jsx";
import FormField from "../components/FormField.jsx";
import usePlanLines from "../hooks/usePlanLines.js";
import { validateBookingForm } from "../rules/bookingValidation.js";
import { EXPERIENCE_OPTIONS, checkEligibility } from "../rules/bookingRules.js";
import { submitBooking } from "../services/mockLoader.js";
import { formatTime } from "../utils/classHelpers.js";

const FIELD_ORDER = ["fullName", "phone", "email", "membership", "memberId", "experience", "agree"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { draft, updateDraft, resetDraft, removeFromPlan, clearPlan, saveLastBooking } = usePlan();
  const { lines, issues, summary } = usePlanLines();

  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const errorSummaryRef = useRef(null);

  // Derived on every render from the current draft – never stored separately.
  const errors = validateBookingForm(draft);
  // Rule 2: advanced classes the declared experience does not allow.
  const ineligible = lines.filter(
    (line) => line.record && !checkEligibility(line.record.level, draft.experience).ok
  );
  const showError = (name) => (touched[name] || submitAttempted) && errors[name];
  const visibleErrors = FIELD_ORDER.filter((name) => errors[name]);
  const experienceChosen = Boolean(draft.experience);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    updateDraft(name, type === "checkbox" ? checked : value);
  };
  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // stay in the SPA; we handle submission ourselves
    setSubmitAttempted(true);
    setSubmitError("");

    const blocked = visibleErrors.length > 0 || issues.length > 0 || (experienceChosen && ineligible.length > 0);
    if (blocked) {
      // Move focus to the error summary so keyboard/screen-reader users hear what to fix.
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    setSubmitting(true);
    try {
      const booking = await submitBooking({
        firstName: draft.fullName.trim().split(" ")[0], // only the first name is kept after submission
        membership: draft.membership,
        sessions: lines.map(({ record, attendees }) => ({
          id: record.id,
          title: record.title,
          when: `${record.day} ${formatTime(record.time)}`,
          room: record.room,
          attendees,
        })),
        summary,
      });
      saveLastBooking(booking);
      clearPlan();
      resetDraft();
      navigate("/confirmation", { state: { booking } });
    } catch {
      setSubmitError("We couldn't send your booking. Your details are still here – please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <p><Link to="/plan" className="back-link">← Back to your plan</Link></p>
      <h1>Your details</h1>
      <LoadGate>
        {lines.length === 0 ? (
          <EmptyState title="There's nothing to book yet" action={<Link className="btn btn--primary" to="/classes">Browse classes</Link>}>
            <p>Add at least one class to your plan before entering your details.</p>
          </EmptyState>
        ) : (
          <div className="two-col">
            <form className="booking-form" noValidate onSubmit={handleSubmit}>
              {submitAttempted && (visibleErrors.length > 0 || issues.length > 0 || (experienceChosen && ineligible.length > 0)) && (
                <div className="banner banner--error" role="alert" tabIndex={-1} ref={errorSummaryRef}>
                  <h2>Please fix the following before confirming</h2>
                  <ul>
                    {visibleErrors.map((name) => (
                      <li key={name}><a href={`#${name}`}>{errors[name]}</a></li>
                    ))}
                    {experienceChosen && ineligible.length > 0 && (
                      <li><a href="#eligibility">{ineligible.length} advanced class(es) don&apos;t match your experience.</a></li>
                    )}
                    {issues.length > 0 && (
                      <li><Link to="/plan">{issues.length} session(s) in your plan are no longer available as selected.</Link></li>
                    )}
                  </ul>
                  <p>Everything you entered correctly has been kept.</p>
                </div>
              )}

              <fieldset>
                <legend>Contact details</legend>
                <FormField id="fullName" label="Full name" required error={showError("fullName")}>
                  {(props) => (
                    <input {...props} name="fullName" type="text" autoComplete="name" value={draft.fullName} onChange={handleChange} onBlur={handleBlur} />
                  )}
                </FormField>
                <FormField id="phone" label="Mobile number" hint="Format: 03XX-XXXXXXX" required error={showError("phone")}>
                  {(props) => (
                    <input {...props} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={draft.phone} onChange={handleChange} onBlur={handleBlur} />
                  )}
                </FormField>
                <FormField id="email" label="Email" required error={showError("email")}>
                  {(props) => (
                    <input {...props} name="email" type="email" autoComplete="email" value={draft.email} onChange={handleChange} onBlur={handleBlur} />
                  )}
                </FormField>
              </fieldset>

              <fieldset className={showError("membership") ? "has-error" : ""} aria-describedby={showError("membership") ? "membership-error" : undefined}>
                <legend>Pricing <span className="required" aria-hidden="true">*</span></legend>
                <div className="radio-cards" id="membership">
                  <label className={`radio-card ${draft.membership === "member" ? "is-checked" : ""}`}>
                    <input type="radio" name="membership" value="member" checked={draft.membership === "member"} onChange={handleChange} onBlur={handleBlur} />
                    <span><strong>Member</strong> – 20% off every class, no booking fee</span>
                  </label>
                  <label className={`radio-card ${draft.membership === "dropin" ? "is-checked" : ""}`}>
                    <input type="radio" name="membership" value="dropin" checked={draft.membership === "dropin"} onChange={handleChange} onBlur={handleBlur} />
                    <span><strong>Drop-in</strong> – Rs 300 booking fee, waived from Rs 6,000</span>
                  </label>
                </div>
                {showError("membership") && <p id="membership-error" className="field__error">⚠ {errors.membership}</p>}
                {draft.membership === "member" && (
                  <FormField id="memberId" label="Member ID" hint="Printed on your card, e.g. MF-1234" required error={showError("memberId")}>
                    {(props) => (
                      <input {...props} name="memberId" type="text" autoCapitalize="characters" value={draft.memberId} onChange={handleChange} onBlur={handleBlur} />
                    )}
                  </FormField>
                )}
              </fieldset>

              <fieldset>
                <legend>Training experience</legend>
                <FormField
                  id="experience"
                  label="How long have you trained regularly?"
                  hint="Advanced classes need Intermediate or Advanced experience."
                  required
                  error={showError("experience")}
                >
                  {(props) => (
                    <select {...props} name="experience" value={draft.experience} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">Choose one</option>
                      {EXPERIENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  )}
                </FormField>
                {experienceChosen && ineligible.length > 0 && (
                  <div id="eligibility" className="banner banner--warning" role="alert">
                    <p><strong>These advanced classes need more experience:</strong></p>
                    <ul className="inline-fix-list">
                      {ineligible.map(({ record }) => (
                        <li key={record.id}>
                          {record.title}{" "}
                          <button type="button" className="btn btn--link" onClick={() => removeFromPlan(record.id)}>
                            Remove from plan
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p>Try a Beginner or Intermediate class in the same style instead.</p>
                  </div>
                )}
              </fieldset>

              <div className={`field field--checkbox ${showError("agree") ? "has-error" : ""}`}>
                <input id="agree" name="agree" type="checkbox" checked={draft.agree} onChange={handleChange} onBlur={handleBlur}
                  aria-invalid={Boolean(showError("agree"))} aria-describedby={showError("agree") ? "agree-error" : undefined} />
                <label htmlFor="agree">I understand this is a simulated booking and payment is taken at the front desk.</label>
              </div>
              {showError("agree") && <p id="agree-error" className="field__error">⚠ {errors.agree}</p>}

              {submitError && <p className="status status--error" role="alert">{submitError}</p>}
              <button type="submit" className="btn btn--primary btn--large btn--block" disabled={submitting}>
                {submitting ? "Confirming…" : "Confirm booking (simulated)"}
              </button>
            </form>

            <SummaryPanel summary={summary} membership={draft.membership} title="Booking summary">
              <ul className="summary__sessions">
                {lines.filter((l) => l.record).map(({ record, attendees }) => (
                  <li key={record.id}>{record.title} – {record.day} {formatTime(record.time)} × {attendees}</li>
                ))}
              </ul>
            </SummaryPanel>
          </div>
        )}
      </LoadGate>
    </>
  );
}
