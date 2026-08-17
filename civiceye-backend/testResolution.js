import "dotenv/config";
import { verifyResolution } from "./src/ai/verifyResolution.js";

try {
    const result = await verifyResolution(
        "./test-images/before.jpg",
        "./test-images/after.jpg"
    );

    console.log(result);
} catch (error) {
    console.error("Resolution verification failed:", error.message);
}