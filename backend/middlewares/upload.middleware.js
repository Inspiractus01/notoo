import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Sets up Multer storage for handling image uploads.
 * Stores files in 'db/media' with a unique name prefixed with 'plant-'.
 */
const storage = multer.diskStorage({
  /**
   * Specifies the destination directory for uploaded files.
   * Creates the folder if it does not exist.
   *
   * @param {Express.Request} req
   * @param {Express.Multer.File} file
   * @param {function(Error|null, string):void} cb
   */
  destination: function (req, file, cb) {
    const dir = "db/media";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  /**
   * Generates a unique filename for uploaded files based on timestamp.
   *
   * @param {Express.Request} req
   * @param {Express.Multer.File} file
   * @param {function(Error|null, string):void} cb
   */
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `plant-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

/**
 * Multer middleware for handling single image upload.
 * Use in route with: `upload.single("image")`
 */
export const upload = multer({ storage });
