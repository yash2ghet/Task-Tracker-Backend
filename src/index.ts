import "./config/network";
import app from "./app";
import { env } from "./config/env";
import { createServer } from "node:http";
import { initializeSocket } from "./socket/socket";

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log("DB host:", new URL(env.DATABASE_URL).host);
});

httpServer.on("error", (error: Error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});