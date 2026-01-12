
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Validate environment variables
if (!process.env.TURSO_CONNECTION_URL) {
  console.error("TURSO_CONNECTION_URL is not set!");
  throw new Error("Database connection URL is missing");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.error("TURSO_AUTH_TOKEN is not set!");
  throw new Error("Database auth token is missing");
}

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log("Database initialized with URL:", process.env.TURSO_CONNECTION_URL.substring(0, 30) + "...");

export const db = drizzle(client, { schema });

export type Database = typeof db;