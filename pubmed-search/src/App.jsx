import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import logo from "./assets/bioseeklogo.png";
import './App.css';
import ProfileCard from "./ProfileCard";
import Background from "./Background"; // Particle background

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 How can I help you with PubMed search?" }
  ]);
  const [input, setInput] = useState("");
  const [animateResults, setAnimateResults] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [results]);

  const API_URL = "http://127.0.0.1:8000";

  // ---------------- SEARCH ----------------
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnimateResults(false);
    setHasSearched(true); // ✅ user started a search

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      setResults(Array.isArray(data) ? data : []);
      console.log("🔍 Results:", data);

      setAnimateResults(true);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch results.");
    }
    setLoading(false);
  };

  // ---------------- CHAT ----------------
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { from: "bot", text: data.reply || "No response" }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "❌ Failed to connect to backend." }
      ]);
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessages(prev => [...prev, { from: "user", text: `📎 Uploaded: ${file.name}` }]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { from: "bot", text: data.summary || "⚠ Could not summarize the file." }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "⚠ Error uploading file." }
      ]);
    }
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflowX: "hidden",
      boxSizing: "border-box",
      background: "black",
    }}>

      {/* Particle Background */}
      <Background style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, position: "relative", zIndex: 10 }}>
        {/* Logo */}
        <div style={{ position: "absolute", top: 20, left: 20, height: 170, zIndex: 10 }}>
          <motion.img src={logo} alt="BioSeek Logo" style={{ height: "170px", maxWidth: "100%", objectFit: "contain" }} />
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginTop: "120px", zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "3rem",
              margin: 0,
              color: "#00ffff",
              textShadow: "0 0 14px rgba(0,184,169,0.9)"
            }}
          >
            BioSeek AI
          </motion.h1>
          <p style={{ color: "white", fontSize: "1rem", marginTop: "4px" }}>
            Accelerating Biomedical Discovery with AI
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px auto 30px auto",
          width: "100%",
          maxWidth: "700px",
          zIndex: 1
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setAnimateResults(false); }}
            placeholder="Discover biomedical insights…"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "12px 0 0 12px",
              border: "1px solid #00B8A9",
              outline: "none",
              fontSize: "16px",
              background: "#161b22",
              color: "white"
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <motion.button
            onClick={() => !loading && handleSearch()}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #00fff" }}
            style={{
              padding: "12px 18px",
              borderRadius: "0 12px 12px 0",
              border: "none",
              backgroundColor:"#00ffff",
              color: "black",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Loader2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <Search className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Loader2 className="animate-spin" size={28} />
            <span style={{ marginLeft: "10px", color: "#aaa" }}>Searching...</span>
          </div>
        ) : results.length > 0 ? (
          results.map((article, index) => (
            <ProfileCard
              key={index}
              title={article.title}
              authors={article.authors}
              year={article.year}
              abstract={article.abstract}
              link={article.link}
            />
          ))
        ) : hasSearched ? (
          <p style={{ textAlign: "center", color: "#aaa", marginTop: "20px" }}>
            No results found
          </p>
        ) : null}
      </div>

      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "20px",
        marginTop: "50px",
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        fontSize: "14px",
        borderTop: "1px solid rgba(0, 184, 169, 0.4)",
        zIndex: 50  
      }}>
        <p style={{ maxWidth: "950px", margin: "0 auto", lineHeight: "1.6" }}>
          <a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" style={{ color: "#00B8A9", fontWeight: "bold", textDecoration: "none" }}>
            NCBI
          </a>{" "}
          (National Center for Biotechnology Information) is part of the U.S. National Library of Medicine.
        </p>
      </footer>
    </div>
  );
}
