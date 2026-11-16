// Demonstration settings used to reproduce edge cases (documented in README).
// They are stored in localStorage so a page refresh keeps the chosen scenario.

export const DEMO_KEY = "mf-demo-settings";

export const DEFAULT_DEMO = {
  failLoad: false, // the mock loader rejects -> error + retry state
  emptyData: false, // the loader returns [] -> "no classes published" state
  availabilityChanged: false, // some classes become full / are removed -> restored-plan conflicts
};

export function readDemoSettings() {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return { ...DEFAULT_DEMO };
    const parsed = JSON.parse(raw);
    // Only keep known boolean keys so corrupted storage can't break the app.
    return Object.fromEntries(
      Object.keys(DEFAULT_DEMO).map((key) => [key, parsed[key] === true])
    );
  } catch {
    return { ...DEFAULT_DEMO };
  }
}

export function writeDemoSettings(settings) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable (private mode); the demo still works for this visit.
  }
}
