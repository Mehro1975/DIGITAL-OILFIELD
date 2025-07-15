import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Move API key to environment variable in production
const API_KEY = "";//PUT THE GEMINI API KEY IN THE BRACKET TO ACCESS THE AI ASSITENT FEATURE LIKE AIzaSyCGClE6FwMOQxdiw3CXNO1gDME9Fu0F2xE
console.log("API key loaded:", API_KEY ? "Yes" : "No");
console.log("First few chars:", API_KEY ? API_KEY.substring(0, 3) + "..." : "None");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
    try {
        console.log("Received message:", req.body.message);

        // Create the system prompt as part of the user's first message instead
        const systemPrompt = "You are an AI assistant specialized in helping employees at oil refineries. Your primary purpose is to provide accurate, helpful information about refinery operations, safety protocols, equipment maintenance, troubleshooting, and best practices. Acknowledge when a question requires specialized expertise beyond your knowledge. Remember that you are assisting professionals in a complex, potentially hazardous industrial environment. Your guidance should be helpful, accurate, and safety-conscious at all times.";
        
        // Initialize chat without history
        const chat = model.startChat({
            generationConfig: { maxOutputTokens: 500 },
        });
        
        // Send system prompt combined with user message
        const combinedMessage = `${systemPrompt}\n\nUser message: ${req.body.message}`;
        const result = await chat.sendMessage(combinedMessage);
        const response = await result.response;
        const text = await response.text();

        console.log("✅ AI Response:", text);
        res.json({ reply: text });

    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ error: "Failed to fetch response from Gemini API" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
