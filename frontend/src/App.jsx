import React, { useState } from "react";
import ChatBubble from "./ChatBubble";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = trimmed;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setHistory((prev) => [userMessage, ...prev]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "No response received." },
      ]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { sender: "bot", text: "Chat cleared. How can I help now?" },
    ]);
    setInput("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-container">
      {/* Top bar */}
      <header className="app-header">
        <h1>Chat Assistant</h1>
        <button className="clear-btn" onClick={clearChat} disabled={loading}>
          Clear
        </button>
      </header>

      <div className="app-main">
        {/* LEFT: history column */}
        <aside className="history-panel">
          <div className="history-header">
            <span>History</span>
          </div>

          <div className="history-body">
            {history.length === 0 && (
              <p className="history-empty">No questions yet.</p>
            )}
            <ul className="history-list">
              {history.map((q, idx) => (
                <li key={idx} className="history-item">
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="history-clear-btn"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            Clear History
          </button>
        </aside>

        {/* RIGHT: chat area */}
        <section className="chat-panel">
          <main className="chat-window">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
            ))}
            {loading && (
              <ChatBubble sender="bot" text="Thinking, please wait..." />
            )}
          </main>

          <footer className="input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              {loading ? "Sending..." : "Send"}
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
