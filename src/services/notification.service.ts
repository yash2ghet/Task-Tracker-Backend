import { db } from "../config/db";
import { notification } from "../db/schema/notification";
import { getSocketIO } from "../socket/socket";

type CreateNotificationInput = {
  userId: string;
  taskId?: string | null;
  title: string;
  message: string;
};

export async function createNotification(
  input: CreateNotificationInput,
) {
  const [created] = await db
    .insert(notification)
    .values({
      id: crypto.randomUUID(), //generate unique ID
      userId: input.userId,
      taskId: input.taskId ?? null,
      title: input.title,
      message: input.message,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to create notification");
  }

  getSocketIO()
    .to(`user:${input.userId}`)
    .emit("notification:new", created); //sends an event

  return created;
}