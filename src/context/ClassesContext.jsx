import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadClasses } from "../services/mockLoader.js";
import { readDemoSettings, writeDemoSettings } from "../services/demoSettings.js";

const ClassesContext = createContext(null);

/**
 * Single source of truth for the timetable data and its loading status.
 * status: "loading" | "error" | "success"
 */
export function ClassesProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [demo, setDemo] = useState(readDemoSettings);

  // Load (or reload) whenever the retry counter or demo settings change.
  useEffect(() => {
    let ignore = false; // cleanup flag: ignore results from an outdated request

    loadClasses(demo)
      .then((records) => {
        if (ignore) return;
        setClasses(records);
        setStatus("success");
      })
      .catch((err) => {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey, demo]);

  // Keep demo settings in localStorage so a refresh reproduces the same scenario.
  useEffect(() => {
    writeDemoSettings(demo);
  }, [demo]);

  // Status is set to "loading" in the event that starts a new request (not inside the effect).
  const reload = useCallback(() => {
    setStatus("loading");
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  const updateDemo = useCallback((key, value) => {
    setStatus("loading");
    setDemo((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Derived lookup table for quick access by id.
  const byId = useMemo(
    () => Object.fromEntries(classes.map((record) => [record.id, record])),
    [classes]
  );

  const value = { classes, byId, status, error, reload, demo, updateDemo };
  return <ClassesContext.Provider value={value}>{children}</ClassesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useClasses() {
  const context = useContext(ClassesContext);
  if (!context) throw new Error("useClasses must be used inside <ClassesProvider>");
  return context;
}
