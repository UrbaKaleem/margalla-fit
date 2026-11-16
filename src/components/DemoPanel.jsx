import { useClasses } from "../context/ClassesContext.jsx";

const OPTIONS = [
  { key: "failLoad", label: "Simulate loading failure (shows error + retry)" },
  { key: "emptyData", label: "Simulate empty timetable (no classes published)" },
  { key: "availabilityChanged", label: "Simulate changed availability (Sunrise Yoga full, Spin Sprint cancelled, Saturday HIIT 1 seat)" },
];

/** Clearly labelled demonstration controls for testing edge cases (see README). */
export default function DemoPanel() {
  const { demo, updateDemo } = useClasses();
  return (
    <details className="demo-panel">
      <summary>Demo controls (for testing edge cases)</summary>
      {OPTIONS.map(({ key, label }) => (
        <div className="field field--checkbox" key={key}>
          <input
            id={`demo-${key}`}
            type="checkbox"
            checked={demo[key]}
            onChange={(e) => updateDemo(key, e.target.checked)}
          />
          <label htmlFor={`demo-${key}`}>{label}</label>
        </div>
      ))}
    </details>
  );
}
