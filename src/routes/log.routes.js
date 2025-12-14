// Log routes

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All log routes require authentication
router.use(authMiddleware);

// TODO: Add log controllers when needed
// router.get("/", getLogs);
// router.get("/:logId", getLog);

export default router;
