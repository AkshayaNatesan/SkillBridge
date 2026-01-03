import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login({ role }) {
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);

      // ✅ ROLE-BASED REDIRECTION (FIXED)
      if (role === "student") {
        navigate("/student");
      } else if (role === "college") {
        navigate("/college");
      } else if (role === "company") {
        navigate("/company");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-bg">
      <div className="login glass">

        {/* ROLE BADGE */}
        <span className="role-badge">
          {role.toUpperCase()}
        </span>

        {/* TITLE */}
        <h2>
          {role === "student" && "Student Login"}
          {role === "college" && "College Login"}
          {role === "company" && "Company Login"}
        </h2>

        {/* BUTTON */}
        <button onClick={login} className="login-btn">
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
