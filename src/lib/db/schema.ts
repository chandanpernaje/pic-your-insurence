import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: varchar("amount", { length: 50 }),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Type exports
export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type SelectQuote = InferSelectModel<typeof quotes>;
export type InsertQuote = InferInsertModel<typeof quotes>;

export type SelectContact = InferSelectModel<typeof contacts>;
export type InsertContact = InferInsertModel<typeof contacts>;
