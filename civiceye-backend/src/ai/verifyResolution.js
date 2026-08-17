import fs from "fs";
import path from "path";
import ai from "./gemini.js";

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

function readImage(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
        throw new Error("Image path is required.");
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
    }

    const data = fs.readFileSync(imagePath);

    return {
        data: data.toString("base64"),
        mimeType: getMimeType(imagePath)
    };
}

function validateResult(result) {
    if (!result || typeof result !== "object") {
        throw new Error("Invalid AI response.");
    }

    if (typeof result.resolved !== "boolean") {
        throw new Error("Invalid resolved value.");
    }

    if (
        typeof result.improvement !== "number" ||
        result.improvement < 0 ||
        result.improvement > 100
    ) {
        throw new Error("Improvement must be between 0 and 100.");
    }

    if (
        typeof result.confidence !== "number" ||
        result.confidence < 0 ||
        result.confidence > 1
    ) {
        throw new Error("Confidence must be between 0 and 1.");
    }

    if (
        typeof result.reason !== "string" ||
        result.reason.trim().length === 0
    ) {
        throw new Error("Invalid reason.");
    }

    return result;
}

export async function verifyResolution(
    beforeImagePath,
    afterImagePath
) {
    const beforeImage = readImage(beforeImagePath);
    const afterImage = readImage(afterImagePath);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: [
            {
                inlineData: {
                    data: beforeImage.data,
                    mimeType: beforeImage.mimeType
                }
            },
            {
                inlineData: {
                    data: afterImage.data,
                    mimeType: afterImage.mimeType
                }
            },
            {
                text: `
Compare the BEFORE and AFTER images of a civic complaint.

Determine whether the original civic issue has actually been resolved.

Return ONLY valid JSON:

{
  "resolved": false,
  "improvement": 0,
  "confidence": 0,
  "reason": ""
}

Rules:
- resolved must be true or false.
- improvement must be a number from 0 to 100.
- confidence must be a number from 0 to 1.
- reason must briefly explain the visual difference.
- Do not include markdown.
- Do not include any text outside the JSON.
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

    return validateResult(result);
}