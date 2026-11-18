import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
]);

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    status: taskStatusEnum("status")
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
    assignedTo: text("assigned_to").references(() => user.id),
  },
  (table) => [
    index("task_status_idx").on(table.status),
    index("task_created_at_idx").on(table.createdAt),
    index("task_assigned_to_idx").on(table.assignedTo),
  ],
);