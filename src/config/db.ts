import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import { env } from "./env";

export const client = postgres(env.DATABASE_URL, {
  prepare: false,
  ssl: "require",
  connect_timeout: 10,
});

export const db = drizzle({ client, schema });