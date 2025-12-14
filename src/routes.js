// Route loader

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import deviceRoutes from "./routes/device.routes.js";
import logRoutes from "./routes/log.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const registerRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/subscriptions", subscriptionRoutes);
  app.use("/api/devices", deviceRoutes);
  app.use("/api/logs", logRoutes);
  app.use("/api/admin", adminRoutes);
};

export default registerRoutes;
