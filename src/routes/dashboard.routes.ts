import { Router } from "express";
import { count, desc, eq } from "drizzle-orm";

import { db } from "../config/db";
import { task, user } from "../db/schema";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    // 1. Count all registered users.
    const [memberResult] = await db
      .select({ total: count() })
      .from(user);

    // 2. Count all tasks.
    const [taskResult] = await db
      .select({ total: count() })
      .from(task);

    // 3. Count completed tasks.
    const [completedResult] = await db
      .select({ total: count() })
      .from(task)
      .where(eq(task.status, "completed"));

    // 4. Count pending tasks.
    const [pendingResult] = await db
      .select({ total: count() })
      .from(task)
      .where(eq(task.status, "pending"));

    // 5. Get tasks for the monthly chart.
    const tasks = await db
      .select({
        status: task.status,
        createdAt: task.createdAt,
      })
      .from(task)
      .orderBy(desc(task.createdAt));

    const totalTasks = Number(taskResult.total);
    const completed = Number(completedResult.total);
    const pending = Number(pendingResult.total);
    const members = Number(memberResult.total);

    // Build the last six calendar months.
    const monthly = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      date.setMonth(date.getMonth() - (5 - index));

      return {
        month: date.toLocaleString("en-US", { month: "short" }),
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
        created: 0,
        completed: 0,
      };
    });

    for (const item of tasks) {
      const createdDate = new Date(item.createdAt);

      const bucket = monthly.find(
        (entry) =>
          entry.monthIndex === createdDate.getMonth() &&
          entry.year === createdDate.getFullYear(),
      );

      if (!bucket) continue;

      bucket.created += 1;

      if (item.status === "completed") {
        bucket.completed += 1;
      }
    }

    return res.json({
      stats: {
        totalMembers: members,
        totalTasks,
        completed,
        pending,
        completedPercentage:
          totalTasks === 0
            ? 0
            : Number(((completed / totalTasks) * 100).toFixed(1)),
        pendingPercentage:
          totalTasks === 0
            ? 0
            : Number(((pending / totalTasks) * 100).toFixed(1)),
      },

      taskStatus: [
        { label: "Completed", value: completed },
        { label: "Pending", value: pending },
        {
          label: "In Progress",
          value: totalTasks - completed - pending,
        },
      ],

      monthly: monthly.map(({ month, created, completed }) => ({
        month,
        created,
        completed,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return res.status(500).json({
      message: "Failed to load dashboard data",
    });
  }
});

export default router;