import type { Request, Response } from "express";
import { and, count, desc, eq } from "drizzle-orm";

import { db } from "../config/db";
import { notification } from "../db/schema/notification";

export const notificationList = async (
  _req: Request,
  res: Response,
) => {

  //get not...
  try {
    const userId = res.locals.user.id;

    const notifications = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, userId))
      .orderBy(desc(notification.createdAt));

    return res.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

export const notificationUnreadCount = async (
  _req: Request,
  res: Response,
) => {
  try {
    const userId = res.locals.user.id;

    //get count of unread not...
    const [result] = await db
      .select({ total: count() })
      .from(notification)
      .where(
        and(
          eq(notification.userId, userId),
          eq(notification.isRead, false),
        ),
      );

    return res.json({
      count: result?.total ?? 0,
    });
  } catch (error) {
    console.error("Failed to count notifications:", error);
    return res.status(500).json({
      message: "Failed to count notifications",
    });
  }
};

export const notificationMarkRead = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = res.locals.user.id;
    const notificationId = req.params.id;

    if (typeof notificationId !== "string") {
      return res.status(400).json({
        message: "Invalid notification ID",
      });
    }

    //mark not as read
    const [updated] = await db
      .update(notification)
      .set({ isRead: true })
      .where(
        and(
          eq(notification.id, notificationId),
          eq(notification.userId, userId),
        ),
      )
      .returning();

    if (!updated) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Failed to update notification:", error);
    return res.status(500).json({
      message: "Failed to update notification",
    });
  }
};