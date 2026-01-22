import { pgTable, varchar, timestamp, integer, pgEnum, } from "drizzle-orm/pg-core";
import { service } from "./services.js";
import { doctor } from "./doctor.js";
export const userGenderEnum = pgEnum("user_gender", ["male", "female"]);
export const patient = pgTable("patients", {
    id: varchar("id")
        .primaryKey(),
    patient: varchar("patient", { length: 255 }).notNull(),
    doctorId: varchar("doctor_id")
        .notNull()
        .references(() => doctor.id),
    serviceId: varchar("service_id")
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
