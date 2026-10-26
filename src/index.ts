import "./config/network";
import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, (err?: Error) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`Server running on port ${env.PORT}`);
  console.log("DB host:", new URL(env.DATABASE_URL).host);
});