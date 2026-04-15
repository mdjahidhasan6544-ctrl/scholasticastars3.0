import "dotenv/config";

import { createApp } from "./backend/app.js";
import { connectDatabase, disconnectDatabase } from "./backend/config/database.js";
import { env, validateServerEnv } from "./backend/config/env.js";
import { logger } from "./backend/utils/logger.js";

validateServerEnv();

const app = createApp();
let server;

async function bootstrap() {
  const connection = await connectDatabase();

  logger.info("MongoDB Atlas connected successfully", {
    host: connection.connection.host,
    database: connection.connection.name
  });

  server = app.listen(env.port, () => {
    logger.info("Server is running", {
      port: env.port,
      environment: env.nodeEnv
    });
  });
}

async function shutdown(signal) {
  logger.warn(`Received ${signal}. Starting graceful shutdown.`);

  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }

  await disconnectDatabase();
  logger.info("Shutdown complete");
  process.exit(0);
}

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap application", {
    message: error.message
  });
  process.exit(1);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal).catch((error) => {
      logger.error("Error during shutdown", { message: error.message });
      process.exit(1);
    });
  });
});