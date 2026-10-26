CREATE TYPE "task_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "task" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"status" "task_status" DEFAULT 'pending'::"task_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "task_status_idx" ON "task" ("status");--> statement-breakpoint
CREATE INDEX "task_created_at_idx" ON "task" ("created_at");