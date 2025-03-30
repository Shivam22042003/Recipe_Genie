require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("❌ API Key is missing. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function fetchRecipes(query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use flash for better availability
        const result = await model.generateContent(query);
        return result.response.text();
    } catch (error) {
        console.error("❌ Gemini API Error:", error);
        throw new Error("Failed to fetch recipes");
    }
}

module.exports = { fetchRecipes };
