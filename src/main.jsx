import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ClassesProvider } from "./context/ClassesContext.jsx";
import { PlanProvider } from "./context/PlanContext.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClassesProvider>
        <PlanProvider>
          <App />
        </PlanProvider>
      </ClassesProvider>
    </BrowserRouter>
  </StrictMode>
);
