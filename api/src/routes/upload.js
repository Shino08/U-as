import { Router } from "express";
import auth from "../middleware/auth.js";
import { uploadService } from "../middleware/upload.js";
import { uploadLanding } from "../middleware/upload.js";

const router = Router();

router.post("/service", auth, uploadService.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha seleccionado ningún archivo para subir" });
  }
  res.json({ filename: req.file.filename, path: `/uploads/services/${req.file.filename}` });
});

router.post("/service/:id", auth, uploadService.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha seleccionado ningún archivo para subir" });
  }
  res.json({ filename: req.file.filename, path: `/uploads/services/${req.file.filename}` });
});

router.post("/landing/:section", auth, uploadLanding.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha seleccionado ningún archivo para subir" });
  }
  res.json({ filename: req.file.filename, path: `/uploads/landing/${req.file.filename}` });
});

export default router;
