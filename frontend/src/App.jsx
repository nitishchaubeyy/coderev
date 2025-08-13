import "highlight.js/styles/github-dark.css";
import "prismjs/themes/prism-tomorrow.css";
import "./App.css";

import { useEffect, useState } from "react";

import axios from "axios";
import prism from "prismjs";
import Markdown from "react-markdown";
import Editor from "react-simple-code-editor";
import rehypeHighlight from "rehype-highlight";
import Loader from "./components/Loader";

function App() {
  console.log("💡 BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

  const [code, setCode] = useState(`function sum(){
  return 1+1
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // ✅ DSA Explainer
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
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          padding: "8px 14px",
          borderRadius: "8px",
          background: darkMode ? "#fff" : "#333",
          color: darkMode ? "#333" : "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <main className={darkMode ? "dark" : "light"}>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>

          <div
            onClick={!loading ? reviewCode : null}
            className={`review ${loading ? "disabled" : ""}`}
          >
            {loading ? "🔄 Reviewing..." : "🚀 Review"}
          </div>

          {/* ✅ DSA Explainer */}
          <div className="dsa-explainer">
            <h2>🧠 DSA Explainer</h2>
            <textarea
              placeholder="Enter your DSA question here..."
              value={dsaPrompt}
              onChange={(e) => setDsaPrompt(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            ></textarea>
            <button onClick={explainDSA}>📘 Explain DSA</button>
            <div className="dsa-result">
              <Markdown rehypePlugins={[rehypeHighlight]}>{dsaResult}</Markdown>
            </div>
          </div>
        </div>

        <div className="right">
          <>
            {loading && <Loader />}
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </>
        </div>
      </main>
    </>
  );
}

export default App;
