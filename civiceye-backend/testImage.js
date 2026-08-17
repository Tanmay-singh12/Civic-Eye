import "dotenv/config";
import fs from "fs";
import ai from "./src/ai/gemini.js";

const imagePath = "./test-images/garbage.jpg";

const imageData = fs.readFileSync(imagePath);
const base64Image = imageData.toString("base64");

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: [
        {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
            }
        },
        {
            text: `
Analyze this image as a civic complaint.

Return ONLY valid JSON.

Use exactly these fields:

{
  "category": "",
  "issue": "",
  "severity": "",
  "confidence": 0,
  "department": "",
  "reason": ""
}

Rules:
- category must be one of: Waste, Roads, Water, Electricity, Drainage, Streetlight, Other
- severity must be one of: LOW, MEDIUM, HIGH
- confidence must be a number between 0 and 1
- department should be the appropriate municipal department
- reason should briefly explain why the issue was classified this way
- Do not include markdown.
- Do not include any text outside the JSON.
`
        }
    ],
    config: {
        responseMimeType: "application/json"
    }
});

console.log(response.text);