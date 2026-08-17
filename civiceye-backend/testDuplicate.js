import "dotenv/config";
import { detectDuplicate } from "./src/ai/detectDuplicate.js";
import fs from "fs";

const complaints = JSON.parse(
    fs.readFileSync("./data/complaints.json", "utf-8")
);

try {
    const result = await detectDuplicate(
        "./test-images/garbage.jpg",
        complaints
    );

    console.log(result);
} catch (error) {
    console.error("Duplicate detection failed:", error.message);
}