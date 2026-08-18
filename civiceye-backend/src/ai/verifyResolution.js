const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT =
  "Compare these two images. Determine whether the civic issue visible in the first " +
  "image has actually been resolved. Return strict JSON with the following keys: " +
  "improvement (percentage as number), resolved (boolean), confidence (number), " +
  "and reason (string explanation).";

/**
 * Compares a "before" and "after" image using the Gemini Vision API
 * to determine whether a civic issue has been resolved.
 *
 * @param {Buffer} beforeImageBuffer - Raw image bytes of the issue before repair.
 * @param {Buffer} afterImageBuffer  - Raw image bytes of the issue after repair.
 * @returns {Promise<{improvement: number, resolved: boolean, confidence: number, reason: string}>}
 */
async function verifyResolution(beforeImageBuffer, afterImageBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Convert image buffers to the inline-data format the SDK expects
    const beforePart = {
      inlineData: {
        data: beforeImageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const afterPart = {
      inlineData: {
        data: afterImageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      beforePart,
      afterPart,
    ]);

    const response = result.response;
    const text = response.text();
    const parsed = JSON.parse(text);

    return {
      improvement: Number(parsed.improvement) || 0,
      resolved: Boolean(parsed.resolved),
      confidence: Number(parsed.confidence) || 0,
      reason: String(parsed.reason || ""),
    };
  } catch (error) {
    console.error("[verifyResolution] Gemini API error:", error.message);
    throw new Error(`Resolution verification failed: ${error.message}`);
  }
}

module.exports = { verifyResolution };
