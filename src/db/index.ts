
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Validate environment variables only if they're needed at runtime
if (!process.env.TURSO_CONNECTION_URL) {
  console.warn("TURSO_CONNECTION_URL is not set - database will fail at runtime");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.warn("TURSO_AUTH_TOKEN is not set - database will fail at runtime");
}

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'libsql://dummy.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'dummy_token',
});

console.log("Database client created");

export const db = drizzle(client, { schema });

export type Database = typeof db;