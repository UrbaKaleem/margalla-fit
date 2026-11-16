import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ClassListPage from "./pages/ClassListPage.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="classes" element={<ClassListPage />} />
        <Route path="classes/:id" element={<ClassDetailsPage />} />
        <Route path="plan" element={<PlanPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
