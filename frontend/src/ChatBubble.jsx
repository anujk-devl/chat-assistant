import React from "react";

export default function ChatBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`chat-bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
      {text}
    </div>
  );
}
