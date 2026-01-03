import React, { useState } from "react";
import "../styles/company.css";

/* ================= MOCK DATA ================= */

const companyProfile = {
  name: "Google",
  industry: "Technology",
  logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  verified: true
};

const studentsDB = [
  { id: 1, name: "Akhil", dept: "CSE", ats: 72, missing: ["Git"] },
  { id: 2, name: "Divya", dept: "IT", ats: 65, missing: ["React"] },
  { id: 3, name: "Rahul", dept: "CSE", ats: 48, missing: ["JS", "React"] }
];

export default function CompanyDashboard() {
  const [active, setActive] = useState("dashboard");
  const [shortlisted, setShortlisted] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [job, setJob] = useState({
    role: "",
    skills: "",
    minATS: ""
  });

  /* ================= LOGIC ================= */

  const shortlistStudent = (student) => {
    if (!shortlisted.find(s => s.id === student.id)) {
      setShortlisted([...shortlisted, student]);
    }
  };

  const postJob = () => {
    if (!job.role || !job.skills || !job.minATS) {
      alert("Please fill all fields");
      return;
    }

    setJobs([...jobs, job]);
    setJob({ role: "", skills: "", minATS: "" });
    alert("Job Posted Successfully ✅");
  };

  const filteredStudents =
    jobs.length === 0
      ? studentsDB
      : studentsDB.filter(s => s.ats >= jobs[jobs.length - 1].minATS);

  /* ================= UI ================= */

  return (
    <div className="company-bg">
      <div className="college-layout">

        {/* SIDEBAR */}
        <div className="college-sidebar glass">
          <h2>Company Panel</h2>
          <ul>
            <li onClick={() => setActive("dashboard")}>Dashboard</li>
            <li onClick={() => setActive("profile")}>Company Profile</li>
            <li onClick={() => setActive("post")}>Post Job</li>
            <li onClick={() => setActive("search")}>Search Students</li>
            <li onClick={() => setActive("shortlist")}>Shortlisted</li>
            <li onClick={() => setActive("insights")}>Insights</li>
            <li className="logout" onClick={() => window.location.href = "/"}>
              Logout
            </li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="college-content">

          {/* DASHBOARD */}
          {active === "dashboard" && (
            <>
              <h1>Company Dashboard</h1>
              <div className="college-cards">
                <div className="glass card"><h3>Jobs Posted</h3><p>{jobs.length}</p></div>
                <div className="glass card"><h3>Applicants</h3><p>{studentsDB.length}</p></div>
                <div className="glass card"><h3>Shortlisted</h3><p>{shortlisted.length}</p></div>
                <div className="glass card"><h3>Avg ATS</h3><p>61%</p></div>
              </div>
            </>
          )}

          {/* PROFILE */}
          {active === "profile" && (
  <div className="glass card company-profile">

    {/* HEADER */}
    <div className="company-header">
      <img
        src={companyProfile.logo}
        alt="company-logo"
        className="company-logo"
      />
      <div>
        <h2 className="company-name">
          {companyProfile.name}
          <span className="verified-badge">✔ Verified</span>
        </h2>
        <p className="company-industry">{companyProfile.industry}</p>
        <a
          href="https://careers.google.com"
          target="_blank"
          rel="noreferrer"
          className="company-link"
        >
          careers.google.com →
        </a>
      </div>
    </div>

    {/* STATS */}
    <div className="company-stats">
      <div><b>Company Size</b><span>100,000+</span></div>
      <div><b>HQ</b><span>California, USA</span></div>
      <div><b>Active Jobs</b><span>3</span></div>
      <div><b>Avg ATS</b><span>65%</span></div>
    </div>

    {/* SKILLS */}
    <div className="company-skills">
      <h3>Top Skills We Hire For</h3>
      <div className="skill-tags">
        <span>React</span>
        <span>JavaScript</span>
        <span>Git</span>
        <span>System Design</span>
        <span>Problem Solving</span>
      </div>
    </div>

    {/* CULTURE */}
    <div className="company-culture">
      <h3>Work Culture</h3>
      <p>
        We focus on innovation, continuous learning, and real-world problem
        solving. Interns work on production-level systems alongside senior
        engineers.
      </p>
    </div>

    {/* ACTIONS */}
    <div className="company-actions">
      <button>View Open Roles</button>
      <button className="outline">Hiring Insights</button>
    </div>

  </div>
)}


          {/* POST JOB */}
          {active === "post" && (
            <div className="glass card">
              <h2>Post New Job</h2>

              <input
                placeholder="Job Role (e.g., Frontend Intern)"
                value={job.role}
                onChange={e => setJob({ ...job, role: e.target.value })}
              />

              <input
                placeholder="Required Skills (React, Git, JS)"
                value={job.skills}
                onChange={e => setJob({ ...job, skills: e.target.value })}
              />

              <input
                placeholder="Minimum ATS %"
                type="number"
                value={job.minATS}
                onChange={e => setJob({ ...job, minATS: e.target.value })}
              />

              <button onClick={postJob}>Post Job</button>
            </div>
          )}

          {/* SEARCH STUDENTS */}
          {active === "search" && (
            <div className="glass card">
              <h2>Skill-Based Student Search</h2>

              {filteredStudents.map(s => {
                const isShortlisted = shortlisted.some(st => st.id === s.id);

                return (
                  <div
                    key={s.id}
                    className={`student-row ${isShortlisted ? "selected" : ""}`}
                  >
                    <b>{s.name}</b> ({s.dept}) — ATS {s.ats}%
                    <br />
                    <span className="missing">
                      Missing: {s.missing.join(", ") || "None 🎉"}
                    </span>
                    <br />
                    <button
                      disabled={isShortlisted}
                      className={isShortlisted ? "btn-done" : ""}
                      onClick={() => shortlistStudent(s)}
                    >
                      {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* SHORTLISTED */}
          {active === "shortlist" && (
            <div className="glass card">
              <h2>Shortlisted Candidates</h2>

              {shortlisted.length === 0 && (
                <p>No students shortlisted yet.</p>
              )}

              {shortlisted.map(s => (
                <div key={s.id} className="student-row selected">
                  <b>{s.name}</b> ({s.dept}) — ATS {s.ats}%
                </div>
              ))}
            </div>
          )}

          {/* INSIGHTS */}
          {active === "insights" && (
            <div className="glass card ai-insights">
  <h2>AI Hiring Insights</h2>

  <p>📊 React missing in 55% applicants</p>
  <p>📊 Git increases ATS by ~12%</p>
  <p>📊 Tech students show higher ATS</p>
</div>

          )}

        </div>
      </div>
    </div>
  );
}
