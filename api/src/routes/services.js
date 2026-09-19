import { Router } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/services.js";

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", getServices);
router.get("/:id", getService);

router.post(
  "/",
  auth,
  [
    body("name").trim().notEmpty().withMessage("El nombre del tratamiento es obligatorio"),
    body("price").isNumeric().withMessage("El precio debe ser un número válido"),
    body("duration").isInt({ min: 15 }).withMessage("La duración debe ser de al menos 15 minutos"),
  ],
  validate,
  createService
);

router.put(
  "/:id",
  auth,
  [
    body("name").optional().trim().notEmpty(),
    body("price").optional().isNumeric(),
    body("duration").optional().isInt({ min: 15 }),
  ],
  validate,
  updateService
);

router.delete("/:id", auth, deleteService);

export default router;
