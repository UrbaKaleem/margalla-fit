import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";

export default function NotFoundPage() {
  return (
    <EmptyState title="Page not found" action={<Link className="btn btn--primary" to="/classes">Browse classes</Link>}>
      <p>This address doesn&apos;t match any page on Margalla Fit.</p>
    </EmptyState>
  );
}
