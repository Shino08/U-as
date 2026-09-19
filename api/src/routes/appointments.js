import { Router } from "express";
import { body, validationResult } from "express-validator";
import { auth, optionalAuth } from "../middleware/auth.js";
import { appointmentRateLimiter } from "../middleware/rateLimit.js";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from "../controllers/appointments.js";

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/", auth, getAppointments);

router.post(
  "/",
  appointmentRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 }),
  optionalAuth,
  [
    body("serviceId").notEmpty().withMessage("El ID de servicio es obligatorio"),
  ],
  validate,
  createAppointment
);

router.put("/:id", auth, updateAppointment);
router.delete("/:id", auth, cancelAppointment);

export default router;
