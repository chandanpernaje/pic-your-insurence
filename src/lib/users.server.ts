import { createServerFn } from "@tanstack/react-start";
import { getDb } from "./db/client";
import { users, type SelectUser } from "./db/schema";
import { eq } from "drizzle-orm";

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const db = getDb();
    return await db.select().from(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
});

export const createUser = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { email: string; name?: string } }) => {
    try {
      const db = getDb();
      const result = await db
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
        })
        .returning();

      if (!result[0]) {
        throw new Error("Failed to create user");
      }

      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },
);

export const getUserById = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: number }) => {
    try {
      const db = getDb();
      const result = await db.select().from(users).where(eq(users.id, data));
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  },
);
