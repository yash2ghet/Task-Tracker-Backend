ALTER TABLE "task" ADD COLUMN "assigned_to" text;--> statement-breakpoint
CREATE INDEX "task_assigned_to_idx" ON "task" ("assigned_to");--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to") REFERENCES "user"("id");