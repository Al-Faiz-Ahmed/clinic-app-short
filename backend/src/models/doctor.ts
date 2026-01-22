
import {
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const doctor = pgTable("doctors", {
  id: varchar("id").primaryKey(),
  doctorName: varchar("doctor_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export type Doctor = typeof doctor.$inferSelect;

export type NewDoctor = typeof doctor.$inferInsert;
