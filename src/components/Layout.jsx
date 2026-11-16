import { NavLink, Outlet } from "react-router-dom";
import { usePlan } from "../context/PlanContext.jsx";

export default function Layout() {
  const { items } = usePlan();
  const navClass = ({ isActive }) => (isActive ? "nav__link is-active" : "nav__link");
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <div className="container site-header__inner">
          <NavLink to="/" className="logo" aria-label="Margalla Fit home">
            <span className="logo__mark" aria-hidden="true">▲</span> Margalla Fit
          </NavLink>
          <nav aria-label="Main">
            <ul className="nav">
              <li><NavLink to="/" end className={navClass}>Home</NavLink></li>
              <li><NavLink to="/classes" className={navClass}>Classes</NavLink></li>
              <li>
                <NavLink to="/plan" className={navClass}>
                  My plan <span className="nav__count" aria-label={`${items.length} sessions`}>{items.length}</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="container main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>Margalla Fit · Plot 12, F-7 Markaz, Islamabad · Student project – all bookings are simulated.</p>
        </div>
      </footer>
    </>
  );
}
