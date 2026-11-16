import { useClasses } from "./context/ClassesContext.jsx";

export default function App() {
  const { classes, status, error, reload } = useClasses();
  if (status === "loading") return <p>Loading timetable…</p>;
  if (status === "error")
    return (
      <p>
        {error} <button onClick={reload}>Retry</button>
      </p>
    );
  return (
    <main>
      <h1>Margalla Fit</h1>
      <p>{classes.length} classes loaded.</p>
    </main>
  );
}
