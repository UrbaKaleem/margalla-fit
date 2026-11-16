import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { EMPTY_FORM } from "../rules/bookingValidation.js";

const PlanContext = createContext(null);

export const PLAN_KEY = "mf-plan-v1";
export const LAST_BOOKING_KEY = "mf-last-booking";

/** Reads the saved plan, discarding anything that isn't a valid {classId, attendees} entry. */
function readSavedPlan() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PLAN_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item && typeof item.classId === "string" && Number.isInteger(item.attendees) && item.attendees > 0
    );
  } catch {
    return [];
  }
}

function readLastBooking() {
  try {
    return JSON.parse(localStorage.getItem(LAST_BOOKING_KEY) ?? "null");
  } catch {
    return null;
  }
}

/**
 * Shared selection state: the weekly plan (persisted), the booking form draft
 * (kept in memory only, so personal details are never written to storage)
 * and the last confirmed booking.
 */
export function PlanProvider({ children }) {
  const [items, setItems] = useState(readSavedPlan); // [{ classId, attendees }]
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [lastBooking, setLastBooking] = useState(readLastBooking);

  // Sync the plan to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable – the plan still works for this visit */
    }
  }, [items]);

  // Keep the plan in sync if it is changed in another browser tab.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === PLAN_KEY) setItems(readSavedPlan());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage); // cleanup
  }, []);

  const addToPlan = useCallback((classId, attendees = 1) => {
    setItems((prev) =>
      prev.some((item) => item.classId === classId)
        ? prev.map((item) => (item.classId === classId ? { ...item, attendees } : item))
        : [...prev, { classId, attendees }]
    );
  }, []);

  const updateAttendees = useCallback((classId, attendees) => {
    setItems((prev) => prev.map((item) => (item.classId === classId ? { ...item, attendees } : item)));
  }, []);

  const removeFromPlan = useCallback((classId) => {
    setItems((prev) => prev.filter((item) => item.classId !== classId));
  }, []);

  const clearPlan = useCallback(() => setItems([]), []);

  const updateDraft = useCallback((name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetDraft = useCallback(() => setDraft(EMPTY_FORM), []);

  const saveLastBooking = useCallback((booking) => {
    setLastBooking(booking);
    try {
      localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(booking));
    } catch {
      /* ignore */
    }
  }, []);

  const value = {
    items,
    addToPlan,
    updateAttendees,
    removeFromPlan,
    clearPlan,
    draft,
    updateDraft,
    resetDraft,
    lastBooking,
    saveLastBooking,
  };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error("usePlan must be used inside <PlanProvider>");
  return context;
}
