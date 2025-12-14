// User routes

import { Router } from "express";
import { getUserDetails } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/:userId", getUserDetails);

export default router;
