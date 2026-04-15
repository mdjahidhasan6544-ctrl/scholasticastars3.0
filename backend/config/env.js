function readNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: readNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGO_URI || "",
  clientUrl: process.env.CLIENT_URL || "*"
};

export function validateServerEnv() {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is required before the backend can start.");
  }
}