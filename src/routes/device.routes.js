// Device routes

import { Router } from "express";
import { getDeviceDetails } from "../controllers/device.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All device routes require authentication
router.use(authMiddleware);

router.get("/:deviceId", getDeviceDetails);

export default router;
