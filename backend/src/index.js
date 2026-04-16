import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import { ensureAdminAccount } from "./utils/ensureAdminAccount.js";

dotenv.config();

const DEFAULT_CLIENT_URLS = [
  "http://localhost:5173",
  "https://scholasticastars3-0-1.onrender.com"
];

function validateEnv() {
  const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function normalizeOrigin(value) {
  return `${value}`.trim().replace(/\/+$/, "");
}

const corsOptions = {
  origin: `${process.env.CLIENT_URL || DEFAULT_CLIENT_URLS.join(",")}`
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean),
  credentials: true
};

validateEnv();

const app = express();
const port = process.env.PORT || 5000;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Scholastica Stars 3.0 backend is running",
    healthCheck: "/api/health"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", studentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorHandler);

connectDB()
  .then(async () => {
    await ensureAdminAccount();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
