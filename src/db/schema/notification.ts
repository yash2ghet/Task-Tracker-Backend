import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { user } from "./user";
import { task } from "./task";

export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id),

    taskId: text("task_id")
      .references(() => task.id),

    title: text("title").notNull(),

    message: text("message").notNull(),

    isRead: boolean("is_read")
      .default(false)
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("notification_user_id_idx").on(table.userId),
    index("notification_created_at_idx").on(table.createdAt),
  ],
);