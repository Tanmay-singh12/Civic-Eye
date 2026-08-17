import fs from "fs";
import path from "path";
import ai from "./gemini.js";

const DUPLICATE_THRESHOLD = 0.85;
const EMBEDDING_MODEL = "gemini-embedding-2";

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

function validateImagePath(imagePath) {
    if (!imagePath || typeof imagePath !== "string") {
        throw new Error("Image path is required.");
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
    }
}

async function getImageData(imageSource) {
    // Cloudinary URL
    if (
        typeof imageSource === "string" &&
        imageSource.startsWith("http")
    ) {
        const response = await fetch(imageSource);

        if (!response.ok) {
            throw new Error(
                `Failed to download image: ${response.status}`
            );
        }

        const contentType =
            response.headers.get("content-type");

        const arrayBuffer = await response.arrayBuffer();

        return {
            base64Image:
                Buffer.from(arrayBuffer).toString("base64"),
            mimeType: contentType
        };
    }

    // Local file
    validateImagePath(imageSource);

    const imageBuffer = fs.readFileSync(imageSource);

    return {
        base64Image: imageBuffer.toString("base64"),
        mimeType: getMimeType(imageSource)
    };
}

async function generateEmbedding(imageSource) {
    const { base64Image, mimeType } =
        await getImageData(imageSource);

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            mimeType,
                            data: base64Image
                        }
                    }
                ]
            }
        ]
    });

    const values = response.embeddings?.[0]?.values;

    if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Failed to generate image embedding.");
    }

    return values;
}

function cosineSimilarity(vectorA, vectorB) {
    if (
        !Array.isArray(vectorA) ||
        !Array.isArray(vectorB) ||
        vectorA.length !== vectorB.length
    ) {
        throw new Error("Invalid embedding dimensions.");
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
        magnitudeA += vectorA[i] ** 2;
        magnitudeB += vectorB[i] ** 2;
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return (
        dotProduct /
        (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
    );
}

export async function detectDuplicate(
    imageSource,
    existingComplaints
) {
    if (!imageSource) {
        throw new Error("Image source is required.");
    }

    if (!Array.isArray(existingComplaints)) {
        throw new Error("existingComplaints must be an array.");
    }

    if (existingComplaints.length === 0) {
        return {
            isDuplicate: false,
            similarity: 0,
            matchingComplaintId: null
        };
    }

    const newEmbedding =
        await generateEmbedding(imageSource);

    let bestMatch = null;

    for (const complaint of existingComplaints) {
        if (
            !complaint.id ||
            (!complaint.imagePath && !complaint.imageUrl)
        ) {
            continue;
        }

        try {
            const imageSource =
                complaint.imageUrl ||
                complaint.imagePath;

            const existingEmbedding =
                complaint.embedding ||
                await generateEmbedding(imageSource);

            const similarity = cosineSimilarity(
                newEmbedding,
                existingEmbedding
            );

            if (
                !bestMatch ||
                similarity > bestMatch.similarity
            ) {
                bestMatch = {
                    id: complaint.id,
                    similarity
                };
            }

        } catch (error) {
            console.warn(
                `Skipping complaint ${complaint.id}: ${error.message}`
            );
        }
    }

    if (!bestMatch) {
        return {
            isDuplicate: false,
            similarity: 0,
            matchingComplaintId: null
        };
    }

    const similarity = Number(
        bestMatch.similarity.toFixed(4)
    );

    return {
        isDuplicate:
            similarity >= DUPLICATE_THRESHOLD,

        similarity,

        matchingComplaintId:
            similarity >= DUPLICATE_THRESHOLD
                ? bestMatch.id
                : null
    };
}