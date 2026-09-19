import multer from "multer";
import { extname } from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, join(__dirname, "..", "uploads", folder));
    },
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)"), false);
  }
};

export const uploadService = multer({
  storage: storage("services"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadLanding = multer({
  storage: storage("landing"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
