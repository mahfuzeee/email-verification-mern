import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import AuthForm from "./components/AuthForm.jsx";
function App() {
  return (
    <BrowserRouter>
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
        </Routes>
      </Router>
    </BrowserRouter>
  );
}

export default App;
