import { useState } from "react";
import { CLASS_TYPES, DAYS, LEVELS } from "../data/classes.js";
import { SORT_OPTIONS, countActiveFilters } from "../utils/classHelpers.js";

/**
 * Search, filter and sort controls. Stateless about the filter values:
 * the parent owns them (in the URL) and receives changes via onChange.
 */
export default function FilterBar({ filters, onChange, onReset }) {
  // Local UI-only state: whether the extra filters are expanded on small screens.
  const [open, setOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  const handleSubmit = (event) => event.preventDefault(); // Enter in search must not reload the page

  return (
    <form className="filter-bar" role="search" onSubmit={handleSubmit} aria-label="Search and filter classes">
      <div className="filter-bar__search">
        <label htmlFor="search">Search classes</label>
        <input
          id="search"
          type="search"
          placeholder="e.g. yoga, Bilal, core"
          value={filters.q}
          onChange={(e) => onChange("q", e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn--secondary filter-bar__toggle"
        aria-expanded={open}
        aria-controls="filter-fields"
        onClick={() => setOpen((prev) => !prev)}
      >
        Filters{activeCount > 0 ? ` (${activeCount} active)` : ""}
      </button>

      <div id="filter-fields" className={`filter-bar__fields ${open ? "is-open" : ""}`}>
        <div className="field">
          <label htmlFor="type">Class type</label>
          <select id="type" value={filters.type} onChange={(e) => onChange("type", e.target.value)}>
            <option value="">All types</option>
            {CLASS_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="level">Level</label>
          <select id="level" value={filters.level} onChange={(e) => onChange("level", e.target.value)}>
            <option value="">All levels</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="day">Day</label>
          <select id="day" value={filters.day} onChange={(e) => onChange("day", e.target.value)}>
            <option value="">Any day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={filters.sort} onChange={(e) => onChange("sort", e.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="field field--checkbox">
          <input
            id="available"
            type="checkbox"
            checked={filters.available}
            onChange={(e) => onChange("available", e.target.checked)}
          />
          <label htmlFor="available">Hide full classes</label>
        </div>
        {activeCount > 0 && (
          <button type="button" className="btn btn--link" onClick={onReset}>
            Clear all filters
          </button>
        )}
      </div>
    </form>
  );
}
