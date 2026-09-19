import { Router } from "express";
import authRoutes from "./auth.js";
import servicesRoutes from "./services.js";
import appointmentsRoutes from "./appointments.js";
import landingRoutes from "./landing.js";
import uploadRoutes from "./upload.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", servicesRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/landing", landingRoutes);
router.use("/upload", uploadRoutes);

export default router;
