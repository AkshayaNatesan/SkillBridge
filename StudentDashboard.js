import React, { useState } from "react";
import "../styles/student.css";

/* ================= GEMINI KEY ================= */
const GEMINI_API_KEY = "AIzaSyAmjE6TDHC2eq01lM908MuG1_DA39dul6k";

/* ================= STUDENT DATA ================= */

const studentProfile = {
  name: "Akhil",
  dept: "CSE",
  skills: ["HTML", "CSS", "JavaScript"],
  achievements: ["Hackathon Winner", "NPTEL Java"],
  verified: true
};

const jobRole = {
  company: "Google",
  role: "Frontend Intern",
  requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Git"]
};

/* ================= CURRENT AFFAIRS ================= */

const currentAffairs = [
  {
    company: "Google",
    title: "Introducing Gemini 3 Flash, a major upgrade to your everyday AI",
    desc: "Gemini 3 Flash is now the new default model in the Gemini app. It offers next-generation intelligence at lightning speed and represents a major capability upgrade over Gemini 2.5 Flash.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    date: "Dec 2025"
  },
  {
    company: "Google",
    title: "Do more with AI for less: Google AI Plus now in India",
    desc: "We are thrilled to see how users in India are using our AI tools in diverse ways, from the Gemini app to NotebookLM. We want even more people to benefit from these advances.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    date: "Dec 2025"
  }
];

/* ================= MOCK QUESTIONS ================= */

const mockQuestions = [
  { q: "Which HTML tag is used for links?", options: ["<a>", "<link>", "<href>", "<url>"], answer: "<a>" },
  { q: "Which CSS property controls layout?", options: ["color", "display", "font", "opacity"], answer: "display" },
  { q: "Which is NOT a JS framework?", options: ["React", "Angular", "Vue", "HTML"], answer: "HTML" },
  { q: "Which hook manages state?", options: ["useState", "useEffect", "useRef", "useMemo"], answer: "useState" },
  { q: "Git command to upload code?", options: ["git push", "git pull", "git clone", "git fork"], answer: "git push" }
];

/* ================= COURSES ================= */

const courses = [
  {
    skill: "React",
    platform: "Google Skillshop",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    link: "https://skillshop.exceedlms.com/student/catalog"
  },
  {
    skill: "Git & Version Control",
    platform: "Coursera",
    logo: "https://static.vecteezy.com/system/resources/previews/067/941/688/non_2x/coursera-rounded-logo-with-transparent-background-for-online-courses-free-png.png",
    link: "https://www.coursera.org"
  },
  {
    skill: "Frontend Development",
    platform: "NPTEL",
    logo: "https://hindi.mysba.in/wp-content/uploads/2023/11/8-1-270x270-1.png",
    link: "https://nptel.ac.in"
  }
];

/* ================= CORE LOGIC ================= */

const analyzeATS = (skills, req) => {
  const matched = req.filter(s => skills.includes(s));
  const missing = req.filter(s => !skills.includes(s));
  return { matched, missing, score: Math.round((matched.length / req.length) * 100) };
};

const eligibility = score =>
  score >= 70 ? "Eligible ✅" : score >= 50 ? "Conditionally Eligible ⚠ Improve skills" : "Not Eligible ❌";

/* ================= COMPONENT ================= */

export default function StudentDashboard() {
  const [newsIndex, setNewsIndex] = useState(0);

const visibleNews = currentAffairs.slice(newsIndex, newsIndex + 2);

  const [active, setActive] = useState("dashboard");

  /* mock test */
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  /* gemini */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([
    { from: "bot", text: "Hi 👋 I’m Gemini. Ask me anything about skills, ATS, placements!" }
  ]);
  const [loading, setLoading] = useState(false);

  const ats = analyzeATS(studentProfile.skills, jobRole.requiredSkills);

  /* ================= REAL GEMINI CHAT ================= */
  const sendChat = async () => {
  if (!chatInput.trim()) return;

  const userText = chatInput;
  setChatInput("");

  setChat(prev => [...prev, { from: "user", text: userText }]);

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAmjE6TDHC2eq01lM908MuG1_DA39dul6k",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Reply casually like a friendly chatbot.
Answer even short messages.
Keep it simple and human.

User: ${userText}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    console.log("Gemini raw:", data);

    let reply =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        ?.join(" ");

    /* 💡 SMART FALLBACKS (THIS IS THE KEY) */
    if (!reply || reply.trim() === "") {
      const lower = userText.toLowerCase();

      if (lower.includes("hi")) reply = "Heyy 👋 How are you doing?";
      else if (lower.includes("study"))
        reply = "📚 Try short study sessions, revise daily, and practice instead of memorizing.";
      else if (lower.includes("ats"))
        reply = "Your ATS score is okay 🙂 Improving React & Git will boost it fast!";
      else
        reply = "😊 I’m here! Ask me about skills, placements, or career tips.";
    }

    setChat(prev => [...prev, { from: "bot", text: reply }]);
  } catch (err) {
    console.error(err);
    setChat(prev => [
      ...prev,
      { from: "bot", text: "😕 Something went wrong. Please try again." }
    ]);
  }
};


  const score = answers.filter((a, i) => a === mockQuestions[i].answer).length;

  return (
    <div className="student-bg">
      <div className="college-layout">

        {/* SIDEBAR */}
        <div className="college-sidebar glass">
          <h2>Student Panel</h2>
          <ul>
            <li onClick={() => setActive("dashboard")}>Dashboard</li>
            <li onClick={() => setActive("profile")}>My Profile</li>
            <li onClick={() => setActive("gap")}>Skill Gap</li>
            <li onClick={() => setActive("mock")}>Mock Test</li>
            <li onClick={() => setActive("courses")}>Courses</li>
            <li onClick={() => setActive("status")}>Placement Status</li>
            <li className="logout" onClick={() => window.location.href = "/"}>Logout</li>
          </ul>
        </div>

        {/* CONTENT */}
        <div className="college-content">

          {active === "dashboard" && (
            <>
              <h1>Student Dashboard</h1>

              <div className="college-cards">
                <div className="glass card"><h3>ATS Score</h3><p>{ats.score}%</p></div>
                <div className="glass card"><h3>Skills</h3><p>{studentProfile.skills.length}</p></div>
                <div className="glass card"><h3>Target</h3><p>{jobRole.company}</p></div>
              </div>

              <h2 className="news-title">📢 Current Affairs</h2>

<div className="news-slider">

  <button
    className="news-arrow"
    disabled={newsIndex === 0}
    onClick={() => setNewsIndex(newsIndex - 1)}
  >
    ◀
  </button>

  <div className="news-track">
    {visibleNews.map((n, i) => (
      <div key={i} className="glass news-card">
        <span className="news-company">{n.company}</span>
        <h3 className="news-head">{n.title}</h3>
        <p className="news-desc">{n.desc}</p>
        <span className="news-date">{n.date}</span>
      </div>
    ))}
  </div>

  <button
    className="news-arrow"
    disabled={newsIndex >= currentAffairs.length - 2}
    onClick={() => setNewsIndex(newsIndex + 1)}
  >
    ▶
  </button>

</div>

            </>
          )}

          {active === "profile" && (
            <div className="glass card">
              <p>Name: {studentProfile.name}</p>
              <p>Department: {studentProfile.dept}</p>
              <p>Skills: {studentProfile.skills.join(", ")}</p>
              <p>Achievements: {studentProfile.achievements.join(", ")}</p>
            </div>
          )}

          {active === "gap" && (
            <div className="glass card">
              <p><b>Matched:</b> {ats.matched.join(", ")}</p>
              <p><b>Missing:</b> {ats.missing.join(", ") || "None 🎉"}</p>
            </div>
          )}

          {active === "mock" && (
            <div className="glass card">
              {!submitted ? (
                <>
                  <p>{mockQuestions[qIndex].q}</p>
                  {mockQuestions[qIndex].options.map(o => (
                    <label key={o} className="option">
                      <input
                        type="radio"
                        checked={answers[qIndex] === o}
                        onChange={() => {
                          const arr = [...answers]; arr[qIndex] = o; setAnswers(arr);
                        }}
                      /> {o}
                    </label>
                  ))}
                  <div className="btn-row">
                    <button disabled={qIndex === 0} onClick={() => setQIndex(qIndex - 1)}>Prev</button>
                    {qIndex < 4
                      ? <button onClick={() => setQIndex(qIndex + 1)}>Next</button>
                      : <button onClick={() => setSubmitted(true)}>Submit</button>}
                  </div>
                </>
              ) : (
                <h2>Score: {score} / 5</h2>
              )}
            </div>
          )}

          {active === "courses" && (
            <div className="college-cards">
              {courses.map((c, i) => (
                <div key={i} className="glass card course-card">
                  <img src={c.logo} alt="" className="course-logo" />
                  <h3>{c.skill}</h3>
                  <p>{c.platform}</p>
                  <a href={c.link} target="_blank" rel="noreferrer">Start →</a>
                </div>
              ))}
            </div>
          )}

          {active === "status" && (
            <div className="glass card">
              <p>Company: {jobRole.company}</p>
              <p>ATS: {ats.score}%</p>
              <p>Status: {eligibility(ats.score)}</p>
            </div>
          )}

        </div>
      </div>

      {/* GEMINI */}
      <div className="gemini-btn" onClick={() => setChatOpen(!chatOpen)}>🤖</div>

      {chatOpen && (
        <div className="gemini-chat glass">
          <div className="chat-body">
            {chat.map((m, i) => (
              <div key={i} className={m.from}>{m.text}</div>
            ))}
            {loading && <div className="bot">Gemini is thinking…</div>}
          </div>
          <input
            value={chatInput}
            placeholder="Ask your doubt..."
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendChat()}
          />
        </div>
      )}
    </div>
  );
}
