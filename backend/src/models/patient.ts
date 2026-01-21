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
import { service } from "./services";
import { doctor } from "./doctor";

export const userGenderEnum = pgEnum("user_gender", ["male", "female"]);

export const patient = pgTable("patients", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  patient: varchar("patient", { length: 255 }).notNull(),
  doctorId: varchar("doctor", { length: 255 })
    .notNull()
    .references(() => doctor.id),
  serviceId: varchar("service_id", { length: 255 })
    .notNull()
    .references(() => service.id),
  token: integer("token").notNull(),
  age: integer("age").default(1).notNull(),
  gender: userGenderEnum("gender").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  discount: integer("discount").default(0).notNull(),
  fee: integer("fee").default(0).notNull(),
  paid: integer("paid").default(0).notNull(),
});

export type Patient = typeof patient.$inferSelect;

export type NewPatient = typeof patient.$inferInsert;
