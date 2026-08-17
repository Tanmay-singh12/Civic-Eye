import "dotenv/config";
import { classifyComplaint } from "./src/ai/classifyComplaint.js";

try {
    const result = await classifyComplaint(
        "./test-images/garbage.jpg"
    );

    console.log(result);
} catch (error) {
    console.error("Classification failed:", error.message);
}