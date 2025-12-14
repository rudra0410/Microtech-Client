// Firebase Admin SDK configuration

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp = null;

try {
  const serviceAccountPath = join(
    __dirname,
    "../../firebase/serviceAccount.json"
  );
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  logger.info("Firebase Admin SDK initialized successfully");
} catch (error) {
  logger.error("Failed to initialize Firebase Admin SDK:", error.message);
  // In development, you might want to continue without Firebase
  // In production, you should fail fast
  if (process.env.NODE_ENV === "production") {
    throw error;
  }
}

export default firebaseApp;
export const auth = firebaseApp ? admin.auth() : null;
