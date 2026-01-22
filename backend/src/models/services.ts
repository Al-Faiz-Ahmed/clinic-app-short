// src/models/user.ts
import { pgTable,  varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const service = pgTable("services", {
  id: varchar("id")
    .primaryKey(),
  fee: integer("fee").notNull().default(0),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Service = typeof service.$inferSelect;

export type NewService = typeof service.$inferInsert;
