// Subscription routes

import { Router } from "express";
import { getStatus } from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All subscription routes require authentication
router.use(authMiddleware);

router.get("/status", getStatus);

export default router;
