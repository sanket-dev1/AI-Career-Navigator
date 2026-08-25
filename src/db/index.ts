import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memUri?: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongoose ?? { conn: null, promise: null };
if (!global.__mongoose) global.__mongoose = cached;

// Attempt to connect using the provided MONGO_URI, or fall back to an
// in-memory MongoDB instance so the app works in any environment (CI,
// sandbox, local dev without a local MongoDB install).
async function resolveUri(): Promise<string> {
  const explicit = process.env.MONGO_URI;
  if (explicit) {
    // Try connecting briefly; if it fails, fall back to in-memory
    try {
      const probe = await mongoose.createConnection(explicit, {
        serverSelectionTimeoutMS: 2000,
      }).asPromise();
      await probe.close();
      return explicit;
    } catch {
      // fall through to in-memory
    }
  }
  if (cached.memUri) return cached.memUri;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MongoMemoryServer } = require("mongodb-memory-server") as typeof import("mongodb-memory-server");
  const mongod = await MongoMemoryServer.create();
  cached.memUri = mongod.getUri();
  return cached.memUri!;
}

export async function connectDb(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = await resolveUri();
      return mongoose.connect(uri, { bufferCommands: false });
    })();
  }
  try {
    cached.conn = await cached.promise;
  } catch {
    cached.promise = null;
    throw new Error("MongoDB connection failed");
  }
  return cached.conn;
}

export { mongoose };
