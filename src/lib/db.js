import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const globalForMongoose = globalThis;

if (!globalForMongoose._mongoose) {
  globalForMongoose._mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (globalForMongoose._mongoose.conn) {
    return globalForMongoose._mongoose.conn;
  }

  if (!globalForMongoose._mongoose.promise) {
    globalForMongoose._mongoose.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  globalForMongoose._mongoose.conn = await globalForMongoose._mongoose.promise;

  return globalForMongoose._mongoose.conn;
}
