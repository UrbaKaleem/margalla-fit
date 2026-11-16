import { Link } from "react-router-dom";
import { CLASS_TYPES } from "../data/classes.js";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">F-7 Markaz, Islamabad</p>
        <h1>Small-group fitness classes that fit around your lectures and work.</h1>
        <p className="hero__lead">
          Plan your week of yoga, HIIT, boxing, Pilates, spin and strength sessions. See prices, levels and seats
          left up front, then book in one go.
        </p>
        <Link className="btn btn--primary btn--large" to="/classes">Browse this week&apos;s classes</Link>
      </section>

      <section aria-labelledby="types-heading" className="section">
        <h2 id="types-heading">Jump to a class type</h2>
        <ul className="chip-list">
          {CLASS_TYPES.map((type) => (
            <li key={type}>
              <Link className="chip" to={`/classes?type=${type}`}>{type}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-heading" className="section">
        <h2 id="how-heading">How booking works</h2>
        <ol className="steps">
          <li><strong>Find classes</strong> by type, level or day.</li>
          <li><strong>Add sessions to your weekly plan</strong> and bring up to 2 friends per session.</li>
          <li><strong>Enter your details</strong> – members get 20% off.</li>
          <li><strong>Review the total and confirm.</strong> Pay at the front desk on arrival.</li>
        </ol>
      </section>
    </>
  );
}
