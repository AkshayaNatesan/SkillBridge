import React, { useState } from "react";
import "../styles/college.css";

/* ===== CHART.JS IMPORTS ===== */
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/* ================= INITIAL DATA ================= */

const initialStudents = [
  {
    id: 1,
    name: "Akhil",
    dept: "CSE",
    resumeSkills: ["HTML", "CSS", "JavaScript"],
    achievements: [
      { title: "Hackathon Winner", type: "hackathon", verified: false },
      { title: "NPTEL Java Certification", type: "certification", verified: false }
    ],
    mockTestAssigned: false
  },
  {
    id: 2,
    name: "Divya",
    dept: "IT",
    resumeSkills: ["Python", "SQL", "Excel"],
    achievements: [
      { title: "Internship at Infosys", type: "internship", verified: false }
    ],
    mockTestAssigned: false
  },
  {
    id: 3,
    name: "Rahul",
    dept: "CSE",
    resumeSkills: [],
    achievements: [],
    mockTestAssigned: false
  }
];

const companies = [
  {
    company: "Google",
    role: "Frontend Intern",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git"]
  },
  {
    company: "Infosys",
    role: "System Engineer",
    skills: ["Java", "SQL", "Problem Solving"]
  },
  {
    company: "Zoho",
    role: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB", "APIs"]
  }
];

const companyLogos = {
  Google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  Infosys: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
  Zoho: "https://brandlogos.net/wp-content/uploads/2023/08/zoho-logo_brandlogos.net_kduhg.png"
};

/* ================= CORE LOGIC ================= */

const achievementWeights = {
  internship: 10,
  hackathon: 15,
  certification: 8,
  award: 12
};

const calculateAchievementBoost = (achievements) =>
  achievements
    .filter(a => a.verified)
    .reduce((sum, a) => sum + (achievementWeights[a.type] || 0), 0);

const analyzeATS = (resumeSkills, jobSkills, achievements) => {
  const matched = jobSkills.filter(skill => resumeSkills.includes(skill));
  const missing = jobSkills.filter(skill => !resumeSkills.includes(skill));

  const baseScore = jobSkills.length
    ? Math.round((matched.length / jobSkills.length) * 100)
    : 0;

  const boost = calculateAchievementBoost(achievements);
  const finalScore = Math.min(baseScore + boost, 100);

  return { matched, missing, score: finalScore };
};

const checkVerificationStatus = (student, atsScore) => {
  if (!student.resumeSkills.length) return "Not Eligible";
  if (student.resumeSkills.length < 3) return "Needs Improvement";
  if (atsScore < 60) return "Needs Improvement";
  return "Verified";
};

/* ================= MAIN COMPONENT ================= */

export default function CollegeDashboard() {
  const [active, setActive] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);

  const verifyAchievement = (studentId, index) => {
    setStudents(
      students.map(s =>
        s.id === studentId
          ? {
              ...s,
              achievements: s.achievements.map((a, i) =>
                i === index ? { ...a, verified: true } : a
              )
            }
          : s
      )
    );
  };

  const assignMockTest = (id) => {
    setStudents(
      students.map(s =>
        s.id === id ? { ...s, mockTestAssigned: true } : s
      )
    );
  };

  /* ===== CHART DATA ===== */
  const skillPool = {};
  students.forEach(s => {
    s.resumeSkills.forEach(skill => {
      skillPool[skill] = (skillPool[skill] || 0) + 1;
    });
  });

  const skillLabels = Object.keys(skillPool);
  const skillCounts = Object.values(skillPool);

  const placed = students.filter(s => s.mockTestAssigned).length;
  const notPlaced = students.length - placed;

  return (
    <div className="college-bg">
      <div className="college-layout">

        {/* SIDEBAR */}
        <div className="college-sidebar glass">
          <h2>College Panel</h2>
          <ul>
            <li onClick={() => setActive("dashboard")}>Dashboard</li>
            <li onClick={() => setActive("students")}>Students</li>
            <li onClick={() => setActive("verify")}>Verify Profiles</li>
            <li onClick={() => setActive("achievements")}>Verify Achievements</li>
            <li onClick={() => setActive("jobs")}>Company Job Matching</li>
            <li onClick={() => setActive("mock")}>Assign Mock Tests</li>
            <li onClick={() => setActive("reports")}>Placement Reports</li>
            <li
              style={{ marginTop: 30, color: "#ff4d4d" }}
              onClick={() => (window.location.href = "/")}
            >
              Logout
            </li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="college-content">

          {active === "dashboard" && (
            <>
              <h1>College Dashboard</h1>
              <div className="college-cards">
                <div className="glass card"><h3>Total Students</h3><p>{students.length}</p></div>
                <div className="glass card"><h3>Verified Students</h3><p>{placed}</p></div>
                <div className="glass card"><h3>Mock Tests</h3><p>{placed}</p></div>
                <div className="glass card"><h3>Companies</h3><p>{companies.length}</p></div>
              </div>
            </>
          )}

          {active === "students" && (
            <>
              <h1>Students Overview</h1>
              <div className="glass card">
                {students.map(s => (
                  <p key={s.id}>{s.name} ({s.dept}) — {s.resumeSkills.join(", ") || "No skills"}</p>
                ))}
              </div>
            </>
          )}

          {active === "verify" && (
            <>
              <h1>Profile Verification</h1>
              <div className="glass card">
                {students.map(s => {
                  const ats = analyzeATS(s.resumeSkills, companies[0].skills, s.achievements);
                  return (
                    <p key={s.id}>
                      {s.name} — ATS {ats.score}% — {checkVerificationStatus(s, ats.score)}
                    </p>
                  );
                })}
              </div>
            </>
          )}

          {active === "achievements" && (
            <>
              <h1>Verify Achievements</h1>
              <div className="glass card">
                {students.map(s => (
                  <div key={s.id}>
                    <b>{s.name}</b>
                    {s.achievements.map((a, i) => (
                      <div key={i}>
                        {a.title} — {a.verified ? "Verified" :
                          <button onClick={() => verifyAchievement(s.id, i)}>Verify</button>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {active === "jobs" && (
            <>
              <h1>Company Matching</h1>
              <div className="company-grid">
  {companies.map((job, idx) => (
    <div key={idx} className="glass card company-card">
      <h3 className="company-title">
        <img
          src={companyLogos[job.company]}
          alt={job.company}
          className="company-logo"
        />
        {job.company} – {job.role}
      </h3>

      <div className="company-students">
        {students.map(s => {
          const ats = analyzeATS(
            s.resumeSkills,
            job.skills,
            s.achievements
          );
          return (
            <div key={s.id} className="company-student-row">
              <span className="student-name">{s.name}</span>
              <span className="ats-score">ATS {ats.score}%</span>
            </div>
          );
        })}
      </div>
    </div>
  ))}
</div>

            </>
          )}

          {active === "mock" && (
            <>
              <h1>Assign Mock Tests</h1>
              <div className="glass card">
                {students.map(s => {
                  const ats = analyzeATS(s.resumeSkills, companies[0].skills, s.achievements);
                  return (
                    <p key={s.id}>
                      {s.name} —
                      {checkVerificationStatus(s, ats.score) !== "Verified"
                        ? " Not Eligible"
                        : s.mockTestAssigned
                        ? " Assigned"
                        : <button onClick={() => assignMockTest(s.id)}>Assign</button>}
                    </p>
                  );
                })}
              </div>
            </>
          )}

          {active === "reports" && (
            <>
              <h1>Placement Reports</h1>
              <div className="college-cards">
                <div className="glass card">
                  <h3>Skill Distribution</h3>
                  <Bar
  data={{
    labels: skillLabels,
    datasets: [
      {
        label: "Students per Skill",
        data: skillCounts,
        backgroundColor: [
          "#00ffff",
          "#00bfff",
          "#7fff00",
          "#ffae42",
          "#ff4d4d",
          "#c77dff"
        ],
        borderColor: "#000",
        borderWidth: 1
      }
    ]
  }}
  options={{
    plugins: {
      legend: {
        labels: {
          color: "black"
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "black" }
      },
      y: {
        ticks: { color: "black" }
      }
    }
  }}
/>

                </div>
                <div className="glass card">
                  <h3>Placement Readiness</h3>
                  <Pie
  data={{
    labels: ["Placement Ready", "Not Ready"],
    datasets: [
      {
        data: [placed, notPlaced],
        backgroundColor: [
          "#00ffcc", // ready
          "#ff4d4d"  // not ready
        ],
        borderColor: "#000",
        borderWidth: 1
      }
    ]
  }}
  options={{
    plugins: {
      legend: {
        labels: {
          color: "black"
        }
      }
    }
  }}
/>


                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
