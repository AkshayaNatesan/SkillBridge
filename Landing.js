import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-bg">
      <div className="glass-card">
        <h1>SkillBridge</h1>
        <p>Where skills meet opportunity.”</p>

        <div className="btn-vertical">
          <button
            className="btn student"
            onClick={() => navigate("/login/student")}
          >
            Student
          </button>

          <button
            className="btn college"
            onClick={() => navigate("/login/college")}
          >
            College
          </button>

          <button
  className="btn company"
  onClick={() => navigate("/login/company")}
>
  Company
</button>

        </div>
      </div>
    </div>
  );
}
