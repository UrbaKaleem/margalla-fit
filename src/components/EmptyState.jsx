/** Reusable empty / not-found message with a next action supplied by the parent. */
export default function EmptyState({ title, children, action }) {
  return (
    <div className="state-box">
      <h2>{title}</h2>
      {children}
      {action && <div className="state-box__actions">{action}</div>}
    </div>
  );
}
