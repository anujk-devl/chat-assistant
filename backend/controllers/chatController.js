import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173", 
    "X-Title": "AI Chat Assistant",
  },
});

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res
        .status(500)
        .json({ error: "OpenRouter API key not configured" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that gives short, direct answers. Do not show calculations or long steps unless the user asks.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 400,
    });

    const reply = response?.choices?.[0]?.message?.content ?? "";
    return res.json({ reply });
  } catch (err) {
    console.error("OpenRouter error:", err);
    return res.status(500).json({ error: "OpenRouter request failed" });
  }
};
