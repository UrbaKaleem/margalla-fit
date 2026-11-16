import { useClasses } from "../context/ClassesContext.jsx";

/**
 * Shows loading / error+retry states for the shared timetable,
 * and renders children only after data has loaded successfully.
 */
export default function LoadGate({ children }) {
  const { status, error, reload } = useClasses();

  if (status === "loading") {
    return (
      <div className="state-box" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Loading this week&apos;s timetable…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="state-box state-box--error" role="alert">
        <h2>We couldn&apos;t load the timetable</h2>
        <p>{error}</p>
        <p>Your saved plan is safe. Check your connection and try again.</p>
        <button type="button" className="btn btn--primary" onClick={reload}>
          Try again
        </button>
      </div>
    );
  }

  return children;
}
