import { createServerFn } from "@tanstack/react-start";
import { getDb } from "./db/client";
import { contacts, type SelectContact } from "./db/schema";

export const createContact = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; message: string } }) => {
    try {
      const db = getDb();
      const result = await db
        .insert(contacts)
        .values({
          name: data.name,
          email: data.email,
          message: data.message,
        })
        .returning();

      if (!result[0]) {
        throw new Error("Failed to create contact");
      }

      return result[0];
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact message");
    }
  },
);

export const getContacts = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const db = getDb();
      return await db.select().from(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to fetch contacts");
    }
  },
);
