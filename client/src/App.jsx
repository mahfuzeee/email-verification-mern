import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import AuthForm from "./components/AuthForm.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
