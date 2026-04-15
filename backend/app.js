import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { requestLogger } from "./middleware/requestLogger.js";
import apiRoutes from "./routes/index.js";

function buildCorsOptions() {
  if (!env.clientUrl || env.clientUrl === "*") {
    return { origin: "*" };
  }

  const allowedOrigins = env.clientUrl
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    origin: allowedOrigins
  };
}

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}