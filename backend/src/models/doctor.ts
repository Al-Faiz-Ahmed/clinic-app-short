// src/models/user.ts
import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const doctor = pgTable("doctors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorName: varchar("doctor_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export type Doctor = typeof doctor.$inferSelect;

export type NewDoctor = typeof doctor.$inferInsert;
