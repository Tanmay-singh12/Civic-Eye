const express = require("express");
const multer = require("multer");
const { verifyResolution } = require("../ai/verifyResolution");

const router = express.Router();

// Store uploads in memory so we can pass raw buffers to Gemini
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

/**
 * POST /verify
 *
 * Expects a multipart/form-data request with two image files:
 *   - beforeImage  (the issue before repair)
 *   - afterImage   (the issue after repair)
 *
 * Returns the Gemini AI verification result as JSON:
 *   { improvement, resolved, confidence, reason }
 */
router.post(
  "/verify",
  upload.fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Validate that both files were provided
      if (!req.files?.beforeImage?.[0] || !req.files?.afterImage?.[0]) {
        return res.status(400).json({
          error: "Both 'beforeImage' and 'afterImage' files are required.",
        });
      }

      const beforeBuffer = req.files.beforeImage[0].buffer;
      const afterBuffer = req.files.afterImage[0].buffer;

      const result = await verifyResolution(beforeBuffer, afterBuffer);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("[resolutionRoutes] /verify error:", error.message);
      return res.status(500).json({
        success: false,
        error: "Verification failed. Please try again.",
      });
    }
  }
);

module.exports = router;
