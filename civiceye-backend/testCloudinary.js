import "dotenv/config";
import cloudinary from "./src/config/cloudinary.js";

try {
    const result = await cloudinary.uploader.upload(
        "./test-images/garbage.jpg",
        {
            folder: "civiceye"
        }
    );

    console.log("Upload successful!");
    console.log("URL:", result.secure_url);
    console.log("Public ID:", result.public_id);

} catch (error) {
    console.error("Cloudinary upload failed:");
    console.error(error);
}