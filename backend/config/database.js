import mongoose from "mongoose";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  return mongoose.connect(process.env.MONGO_URI, {
    dbName: "scholastica3"
  });
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}