CREATE TYPE "public"."user_gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" varchar PRIMARY KEY NOT NULL,
	"doctor_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" varchar PRIMARY KEY NOT NULL,
	"patient" varchar(255) NOT NULL,
	"doctor_id" varchar NOT NULL,
	"service_id" varchar NOT NULL,
	"token" integer NOT NULL,
	"age" integer DEFAULT 1 NOT NULL,
	"gender" "user_gender" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"fee" integer DEFAULT 0 NOT NULL,
	"paid" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar PRIMARY KEY NOT NULL,
	"fee" integer DEFAULT 0 NOT NULL,
	"service_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;