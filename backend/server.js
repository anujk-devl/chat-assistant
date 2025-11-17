import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { chat } from "./controllers/chatController.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Backend is up" }));

app.post("/api/chat", chat);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
