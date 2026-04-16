import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // ✅ DSA Explainer States
  const [dsaPrompt, setDsaPrompt] = useState("");
  const [dsaResult, setDsaResult] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/get-review`,
        { code }
      );
      setReview(response.data);
    } catch (error) {
      console.error("Review error:", error);
      setReview("❌ Review failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function explainDSA() {
    if (!dsaPrompt.trim()) return alert("Please enter a topic!");
    
    setDsaResult("⏳ Generating explanation...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/explain-dsa`,
        { topic: dsaPrompt }
      );
      setDsaResult(response.data);
    } catch (err) {
      console.error("❌ DSA Error:", err);
      setDsaResult("❌ Could not get DSA explanation. Try again.");
    }
  }

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        style={{
          background: darkMode ? "#fff" : "#333",
          color: darkMode ? "#333" : "#fff",
        }}
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <main className={darkMode ? "dark" : "light"}>
        {/* Top Section: Code Editor and Review Output side-by-side */}
        <section className="review-container">
          <div className="left">
            <div className="code">
              <Editor
                value={code}
                onValueChange={(newCode) => setCode(newCode)}
                highlight={(code) =>
                  prism.highlight(code, prism.languages.javascript, "javascript")
                }
                padding={10}
                className="code-editor"
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                }}
              />
            </div>
            <div
              onClick={!loading ? reviewCode : null}
              className={`review ${loading ? "disabled" : ""}`}
            >
              {loading ? "🔄 Reviewing..." : "🚀 Review Code"}
            </div>
          </div>

          <div className="right">
            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
                <div className="skeleton-line"></div>
              </div>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review || "### Review results will appear here..."}
              </Markdown>
            )}
          </div>
        </section>

        {/* Bottom Section: DSA Explainer taking full width below */}
        <section className="dsa-section">
          <div className="dsa-explainer">
            <h2>🧠 DSA Explainer</h2>
            <textarea
              placeholder="Enter your DSA question or topic here..."
              value={dsaPrompt}
              onChange={(e) => setDsaPrompt(e.target.value)}
              rows={4}
            ></textarea>
            <button className="dsa-btn" onClick={explainDSA}>📘 Explain DSA</button>
            <div className="dsa-result">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {dsaResult}
              </Markdown>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;