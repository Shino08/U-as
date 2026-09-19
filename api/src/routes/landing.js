import { Router } from "express";
import { getLandingContent, updateLandingContent } from "../controllers/landing.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", getLandingContent);
router.put("/", auth, updateLandingContent);

export default router;
