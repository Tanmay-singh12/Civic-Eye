import "dotenv/config";
import { detectDuplicate } from "./ai/detectDuplicate.js";
import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "./config/cloudinary.js";

import { classifyComplaint } from "./ai/classifyComplaint.js";
import { generatePriority } from "./ai/generatePriority.js";
import { verifyResolution } from "./ai/verifyResolution.js";

const app = express();

app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        cb(
            null,
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}${extension}`
        );
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only JPG, PNG, and WEBP images are allowed.")
            );
        }

        cb(null, true);
    }
});


/*
 * Health check
 */
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "CivicEye AI",
        status: "running"
    });
});


/*
 * Complaint classification
 *
 * POST /api/ai/classify
 * Form-data:
 * image: <image file>
 */
app.post("/api/ai/classify", upload.single("image"), async (req, res) => {
    let imagePath;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Image is required."
            });
        }

        imagePath = req.file.path;

        const classification = await classifyComplaint(imagePath);

        res.json({
            success: true,
            data: classification
        });

    } catch (error) {
        console.error("Classification error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    } finally {
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
});


/*
 * Priority calculation
 *
 * POST /api/ai/priority
 */
app.post("/api/ai/priority", (req, res) => {
    try {
        const result = generatePriority(req.body);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Priority error:", error);

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});


/*
 * Resolution verification
 *
 * POST /api/ai/verify-resolution
 *
 * Form-data:
 * before: <before image>
 * after: <after image>
 */
app.post(
    "/api/ai/verify-resolution",
    upload.fields([
        { name: "before", maxCount: 1 },
        { name: "after", maxCount: 1 }
    ]),
    async (req, res) => {
        let beforePath;
        let afterPath;

        try {
            if (
                !req.files?.before?.[0] ||
                !req.files?.after?.[0]
            ) {
                return res.status(400).json({
                    success: false,
                    error: "Both before and after images are required."
                });
            }

            beforePath = req.files.before[0].path;
            afterPath = req.files.after[0].path;

            const result = await verifyResolution(
                beforePath,
                afterPath
            );

            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error("Resolution verification error:", error);

            res.status(500).json({
                success: false,
                error: error.message
            });

        } finally {
            if (beforePath && fs.existsSync(beforePath)) {
                fs.unlinkSync(beforePath);
            }

            if (afterPath && fs.existsSync(afterPath)) {
                fs.unlinkSync(afterPath);
            }
        }
    }
);


/*
 * Global error handler
 */
app.use((error, req, res, next) => {
    console.error("Server error:", error);

    res.status(400).json({
        success: false,
        error: error.message || "Something went wrong."
    });
});

app.post("/api/ai/duplicate", upload.single("image"), async (req, res) => {
    let imagePath;

    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Image is required."
            });
        }

        imagePath = req.file.path;

        /*
         * Upload incoming image to Cloudinary
         */
        const uploadResult = await cloudinary.uploader.upload(
            imagePath,
            {
                folder: "civiceye/complaints"
            }
        );

        const imageUrl = uploadResult.secure_url;

        console.log("Image uploaded to Cloudinary:");
        console.log(imageUrl);

        /*
         * Existing complaints
         *
         * For now CMP-001 still uses the test image.
         * Later this will come from the database
         * and contain imageUrl from Cloudinary.
         */
        const existingComplaints = [
            {
                id: "CMP-001",
                imagePath: path.join(
                    process.cwd(),
                    "test-images",
                    "garbage.jpg"
                )
            }
        ];

        /*
         * Run duplicate detection
         *
         * New image is still read from the temporary
         * local file because detectDuplicate generates
         * the Gemini embedding from the image bytes.
         */
        const result = await detectDuplicate(
            imagePath,
            existingComplaints
        );

        res.json({
            success: true,
            data: {
                ...result,
                imageUrl
            }
        });

    } catch (error) {
        console.error("Duplicate detection error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    } finally {
        /*
         * Remove temporary local image.
         *
         * The permanent copy is already in Cloudinary.
         */
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
});

app.listen(PORT, () => {
    console.log(`CivicEye AI server running on port ${PORT}`);
});