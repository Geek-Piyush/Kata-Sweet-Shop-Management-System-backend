import sharp from "sharp";
import path from "path";
import fs from "fs";

/**
 * Compress and resize sweet images to 512x512
 * @param {string} inputPath - Path to original image
 * @param {string} outputPath - Path to save compressed image (optional)
 * @returns {Promise<string>} Path to compressed image
 */
export const compressSweetImage = async (inputPath, outputPath = null) => {
  try {
    // If no output path provided, replace original
    const finalOutputPath =
      outputPath ||
      inputPath.replace(path.extname(inputPath), "-compressed.jpg");

    await sharp(inputPath)
      .resize(512, 512, {
        fit: "cover", // Crop to fill the dimensions
        position: "center",
      })
      .jpeg({
        quality: 85, // Good balance between quality and size
        progressive: true,
      })
      .toFile(finalOutputPath);

    // If we created a new file, delete the original
    if (outputPath === null && finalOutputPath !== inputPath) {
      fs.unlinkSync(inputPath);
      // Rename compressed file to original name
      fs.renameSync(finalOutputPath, inputPath);
      return inputPath;
    }

    return finalOutputPath;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to compress image");
  }
};

/**
 * Process profile photo (resize without strict dimensions)
 * @param {string} inputPath - Path to original image
 * @returns {Promise<string>} Path to processed image
 */
export const processProfilePhoto = async (inputPath) => {
  try {
    const tempPath = inputPath + ".temp.jpg";

    await sharp(inputPath)
      .resize(300, 300, {
        fit: "cover",
        position: "center",
      })
      .jpeg({
        quality: 90,
        progressive: true,
      })
      .toFile(tempPath);

    // Replace original with processed image
    fs.unlinkSync(inputPath);
    fs.renameSync(tempPath, inputPath);

    return inputPath;
  } catch (error) {
    console.error("Error processing profile photo:", error);
    throw new Error("Failed to process profile photo");
  }
};

/**
 * Delete an image file
 * @param {string} filePath - Path to image file
 */
export const deleteImage = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
