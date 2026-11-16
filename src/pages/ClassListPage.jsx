import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useClasses } from "../context/ClassesContext.jsx";
import { usePlan } from "../context/PlanContext.jsx";
import LoadGate from "../components/LoadGate.jsx";
import FilterBar from "../components/FilterBar.jsx";
import ClassCard from "../components/ClassCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import {
  DEFAULT_FILTERS,
  filterAndSortClasses,
  filtersFromParams,
  filtersToParams,
} from "../utils/classHelpers.js";

export default function ClassListPage() {
  const { classes } = useClasses();
  const { items, addToPlan, removeFromPlan } = usePlan();
  // Filters live in the URL so they survive Back/Forward, refresh and sharing.
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  const results = useMemo(() => filterAndSortClasses(classes, filters), [classes, filters]);

  // Planned classes stay in the plan even when filters hide them; tell the user.
  const hiddenPlanned = items.filter(
    (item) => classes.some((c) => c.id === item.classId) && !results.some((r) => r.id === item.classId)
  ).length;

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    // replace: typing in search shouldn't add one history entry per keystroke
    setSearchParams(filtersToParams(next), { replace: true });
  };
  const resetFilters = () => setSearchParams(filtersToParams({ ...DEFAULT_FILTERS, sort: filters.sort }), { replace: true });

  return (
    <>
      <h1>This week&apos;s classes</h1>
      <LoadGate>
        {classes.length === 0 ? (
          <EmptyState title="No classes are published yet">
            <p>The timetable for this week hasn&apos;t been released. New classes are usually added on Sunday evening.</p>
            <p>Questions? Call the front desk on 051-0000000 (fictional).</p>
          </EmptyState>
        ) : (
          <>
            <FilterBar filters={filters} onChange={updateFilter} onReset={resetFilters} />
            <p className="results-count" aria-live="polite">
              Showing {results.length} of {classes.length} classes
              {hiddenPlanned > 0 &&
                ` · ${hiddenPlanned} class${hiddenPlanned === 1 ? "" : "es"} in your plan hidden by filters (still saved)`}
            </p>
            {results.length === 0 ? (
              <EmptyState
                title="No classes match your search"
                action={
                  <button type="button" className="btn btn--primary" onClick={resetFilters}>
                    Clear search and filters
                  </button>
                }
              >
                <p>Try a different word, choose &quot;Any day&quot;, or turn off &quot;Hide full classes&quot;.</p>
              </EmptyState>
            ) : (
              <ul className="class-grid">
                {results.map((record) => (
                  <li key={record.id}>
                    <ClassCard
                      record={record}
                      planItem={items.find((item) => item.classId === record.id)}
                      onAdd={addToPlan}
                      onRemove={removeFromPlan}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </LoadGate>
    </>
  );
}
