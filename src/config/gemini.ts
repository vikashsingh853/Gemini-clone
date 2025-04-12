// npm i @google/generative-ai

import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function runGemini(prompt: string | (string | Part)[]) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(prompt);
    const res = result.response.text()
    console.log(result.response.text());
    return res ? res : ''
}

export default runGemini