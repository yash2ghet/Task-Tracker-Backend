import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../config/db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { env } from "../config/env";

let io: Server | undefined;

export function initializeSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.request.headers),
      });

      if (!session) {
        return next(new Error("Unauthorized"));
      }

      const [currentUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);

      if (!currentUser) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = currentUser.id;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    socket.join(`user:${userId}`);

    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getSocketIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}