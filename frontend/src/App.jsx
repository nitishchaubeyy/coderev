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
  console.log("💡 BACKEND URL:", import.meta.env.VITE_BACKEND_URL);

  const [code, setCode] = useState(`function sum(){
  return 1+1
}`);
  const [review, setreview] = useState(``);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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
      setreview(response.data);
    } catch (error) {
      console.error("Review error:", error);
      setreview("❌ Review failed. Please try again.");
    } finally {
      setLoading(false);
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
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
