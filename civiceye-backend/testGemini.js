import "dotenv/config";
import ai from "./src/ai/gemini.js";

const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: "Say hello to CivicEye in one sentence."
});

console.log(response.text);