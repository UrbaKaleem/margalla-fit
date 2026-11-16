// Asynchronous mock "API" for local data. Nothing leaves the browser.
import classData from "../data/classes.js";

export const LOAD_DELAY_MS = 700;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Loads the class timetable after a short delay.
 * @param {{failLoad?: boolean, emptyData?: boolean, availabilityChanged?: boolean}} demo
 * @returns {Promise<Array>} resolves with copies of the class records
 */
export async function loadClasses(demo = {}) {
  await wait(LOAD_DELAY_MS);

  if (demo.failLoad) {
    throw new Error("The timetable service did not respond (simulated failure).");
  }
  if (demo.emptyData) {
    return [];
  }

  // Copy each record so later changes never mutate the imported module data.
  let records = classData.map((record) => ({ ...record }));

  if (demo.availabilityChanged) {
    // Simulate the timetable changing since the user last saved a plan.
    records = records
      .filter((record) => record.id !== "spin-sprint") // class cancelled
      .map((record) => {
        if (record.id === "sunrise-yoga") return { ...record, seatsBooked: record.seatsTotal }; // now full
        if (record.id === "weekend-hiit") return { ...record, seatsBooked: record.seatsTotal - 1 }; // 1 seat left
        return record;
      });
  }

  return records;
}

/**
 * Simulated booking submission. Returns a reference number; no payment is taken.
 */
export async function submitBooking(booking) {
  await wait(600);
  const reference = "MF-" + Date.now().toString(36).toUpperCase().slice(-6);
  return { ...booking, reference, createdAt: new Date().toISOString() };
}
