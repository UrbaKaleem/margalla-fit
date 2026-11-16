/**
 * Label + control + hint + error wrapper. The control is passed as children
 * via a render function so it receives the right ids/aria attributes.
 */
export default function FormField({ id, label, hint, error, required, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`field ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, required })}
      {error && (
        <p id={errorId} className="field__error">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}
    </div>
  );
}
