import "dotenv/config";

console.log(
    process.env.GEMINI_API_KEY
        ? "API key loaded successfully"
        : "API key NOT loaded"
);