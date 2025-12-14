// Express app configuration

import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { securityConfig } from "./configs/security.config.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware.js";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.js";
import registerRoutes from "./routes.js";
import logger from "./utils/logger.util.js";

// Load environment variables
configDotenv();

const app = express();

// Security middleware
app.use(securityConfig);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Health check endpoint (before rate limiting)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rate limiting (apply to all routes except health check)
app.use(rateLimitMiddleware);

// Register all routes
registerRoutes(app);

// 404 handler (must be after all routes)
app.use(notFoundMiddleware);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
