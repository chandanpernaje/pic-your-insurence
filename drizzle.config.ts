import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

dotenv.config({ path: ".env" });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
} satisfies Config;
