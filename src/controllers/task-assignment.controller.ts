import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../config/db";
import { task, user } from "../db/schema";
import { createNotification } from "../services/notification.service";

export const assignTask = async (
  req: Request,
  res: Response,
) => {
  try {
    // read request data
    const taskId = req.params.id;
    const { userId } = req.body ?? {};

    //validate input
    if (
      typeof taskId !== "string" ||
      typeof userId !== "string" ||
      !userId.trim()
    ) {
      return res.status(400).json({
        message: "Valid task ID and user ID are required",
      });
    }

    //fine employee
    const [employee] = await db
      .select({
        id: user.id,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!employee) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //verify role
    if (employee.role !== "employee") {
      return res.status(400).json({
        message: "Tasks can only be assigned to employees",
      });
    }

    // update task assign...
    const [updatedTask] = await db
      .update(task)
      .set({
        assignedTo: employee.id,
        updatedAt: new Date(),
      })
      .where(eq(task.id, taskId))
      .returning();

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    //create notifi....
    try {
      await createNotification({
        userId: employee.id,
        taskId: updatedTask.id,
        title: "New task assigned",
        message: `You have been assigned: ${updatedTask.title}`,
      });
    } catch (error) {
      console.error("Notification delivery failed:", error);

      return res.status(500).json({
        message:
          "Task was assigned, but notification creation or delivery failed",
        task: updatedTask,
      });
    }

    return res.json({
      message: "Task assigned successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Task assignment failed:", error);

    return res.status(500).json({
      message: "Failed to assign task",
    });
  }
};