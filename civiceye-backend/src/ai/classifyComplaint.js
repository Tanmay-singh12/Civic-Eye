import fs from "fs";
import path from "path";
import ai from "./gemini.js";

const ALLOWED_CATEGORIES = [
    "Waste",
    "Roads",
    "Water",
    "Electricity",
    "Drainage",
    "Streetlight",
    "Other"
];

const ALLOWED_SEVERITIES = [
    "LOW",
    "MEDIUM",
    "HIGH"
];

function getMimeType(imagePath) {
    const extension = path.extname(imagePath).toLowerCase();

    const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp"
    };

    const mimeType = mimeTypes[extension];

    if (!mimeType) {
        throw new Error(
            "Unsupported image format. Use JPG, JPEG, PNG, or WEBP."
        );
    }

    return mimeType;
}

function validateClassification(result) {
    if (!result || typeof result !== "object") {
        throw new Error("Invalid AI response.");
    }

    if (!ALLOWED_CATEGORIES.includes(result.category)) {
        throw new Error(`Invalid category: ${result.category}`);
    }

    if (
        typeof result.issue !== "string" ||
        result.issue.trim().length === 0
    ) {
        throw new Error("Invalid issue.");
    }

    if (!ALLOWED_SEVERITIES.includes(result.severity)) {
        throw new Error(`Invalid severity: ${result.severity}`);
    }

    if (
        typeof result.confidence !== "number" ||
        result.confidence < 0 ||
        result.confidence > 1
    ) {
        throw new Error("Invalid confidence value.");
    }

    if (
        typeof result.department !== "string" ||
        result.department.trim().length === 0
    ) {
        throw new Error("Invalid department.");
    }

    if (
        typeof result.reason !== "string" ||
        result.reason.trim().length === 0
    ) {
        throw new Error("Invalid reason.");
    }

    return result;
}

export async function classifyComplaint(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
        throw new Error("Image path is required.");
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
    }

    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");
    const mimeType = getMimeType(imagePath);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: [
            {
                inlineData: {
                    data: base64Image,
                    mimeType
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
- department must be the appropriate municipal department
- reason must briefly explain the classification
- Do not include markdown
- Do not include text outside JSON
`
            }
        ],

        config: {
            responseMimeType: "application/json"
        }
    });

    let result;

    try {
        result = JSON.parse(response.text);
    } catch {
        throw new Error("Gemini returned invalid JSON.");
    }

    return validateClassification(result);
}