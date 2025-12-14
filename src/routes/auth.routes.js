// Authentication routes

import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Login endpoint - requires Firebase token
router.post("/login", authMiddleware, login);

export default router;
