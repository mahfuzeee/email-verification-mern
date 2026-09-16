import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import AuthForm from "./components/AuthForm.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
