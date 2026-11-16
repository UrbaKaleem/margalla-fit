// Pure helpers for displaying, searching, filtering and sorting classes.
import { CLASS_TYPES, DAYS, LEVELS } from "../data/classes.js";

export function seatsLeft(record) {
  return Math.max(0, record.seatsTotal - record.seatsBooked);
}

export function formatPKR(amount) {
  return "Rs " + Math.round(amount).toLocaleString("en-PK");
}

export function formatTime(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const SORT_OPTIONS = [
  { value: "schedule", label: "Day and time" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "seats-desc", label: "Most seats left" },
];

export const DEFAULT_FILTERS = { q: "", type: "", level: "", day: "", available: false, sort: "schedule" };

/**
 * Reads filters from URL search params, ignoring unknown values so a
 * hand-edited URL can never put the page in an invalid state.
 */
export function filtersFromParams(params) {
  const pick = (key, allowed) => (allowed.includes(params.get(key)) ? params.get(key) : "");
  const sort = params.get("sort");
  return {
    q: (params.get("q") ?? "").slice(0, 60),
    type: pick("type", CLASS_TYPES),
    level: pick("level", LEVELS),
    day: pick("day", DAYS),
    available: params.get("available") === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : DEFAULT_FILTERS.sort,
  };
}

/** Converts filters back to URL params, leaving out defaults to keep URLs short. */
export function filtersToParams(filters) {
  const params = {};
  if (filters.q.trim()) params.q = filters.q;
  if (filters.type) params.type = filters.type;
  if (filters.level) params.level = filters.level;
  if (filters.day) params.day = filters.day;
  if (filters.available) params.available = "1";
  if (filters.sort !== DEFAULT_FILTERS.sort) params.sort = filters.sort;
  return params;
}

export function countActiveFilters(filters) {
  const { q, type, level, day, available } = filters;
  return [q.trim(), type, level, day, available].filter(Boolean).length;
}

const scheduleKey = (record) => DAYS.indexOf(record.day) * 10000 + Number(record.time.replace(":", ""));

/** Search (title, type, instructor, description) + filters + sort. Returns a new array. */
export function filterAndSortClasses(classes, filters) {
  const query = filters.q.trim().toLowerCase();

  const matches = classes.filter((record) => {
    if (query) {
      const haystack = [record.title, record.type, record.instructor, record.description, record.level]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.type && record.type !== filters.type) return false;
    if (filters.level && record.level !== filters.level) return false;
    if (filters.day && record.day !== filters.day) return false;
    if (filters.available && seatsLeft(record) === 0) return false;
    return true;
  });

  const comparators = {
    schedule: (a, b) => scheduleKey(a) - scheduleKey(b),
    "price-asc": (a, b) => a.price - b.price || scheduleKey(a) - scheduleKey(b),
    "price-desc": (a, b) => b.price - a.price || scheduleKey(a) - scheduleKey(b),
    "seats-desc": (a, b) => seatsLeft(b) - seatsLeft(a) || scheduleKey(a) - scheduleKey(b),
  };

  // Copy before sorting: Array.prototype.sort mutates.
  return [...matches].sort(comparators[filters.sort] ?? comparators.schedule);
}
