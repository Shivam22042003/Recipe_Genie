require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error("❌ API Key is missing. Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function fetchRecipes(query, retries = 3) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(query);
        return result.response.text();
    } catch (error) {
        console.error("❌ Gemini API Error:", error);

        if (error.status === 503 && retries > 0) {
            console.log(`🔄 Retrying in 5 seconds... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return fetchRecipes(query, retries - 1);
        }

        throw new Error("Failed to fetch recipes");
    }
}

module.exports = { fetchRecipes };
