import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import CollegeDashboard from "./pages/CollegeDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/student" element={<Login role="student" />} />
        <Route path="/login/college" element={<Login role="college" />} />
        <Route path="/login/company" element={<Login role="company" />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/college" element={<CollegeDashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
