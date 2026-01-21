// src/models/user.ts
import { pgTable, uuid, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const service = pgTable("services", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fee: integer("fee").notNull().default(0),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Service = typeof service.$inferSelect;

export type NewService = typeof service.$inferInsert;
