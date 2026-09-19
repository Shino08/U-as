import { Router } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import { register, login } from "../controllers/auth.js";

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Se requiere un correo electrónico válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Se requiere un correo electrónico válido"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  validate,
  login
);

export default router;
