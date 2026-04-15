import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  return mongoose.connect(env.mongoUri, {
    dbName: "scholastica3"
  });
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}