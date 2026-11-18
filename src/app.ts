// import express from "express";
// import cors from "cors";

// import {
//   toNodeHandler,
//   fromNodeHeaders,
// } from "better-auth/node";

// import { auth } from "../lib/auth";
// import { env } from "./config/env";
// import dashboardRouter from "./routes/dashboard.routes";
// import { requireAuth, requirePermission } from "./middleware/auth.middleware";

// const app = express();

// app.use(
//   cors({
//     origin: env.FRONTEND_URL, // Replace with your frontend's origin
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed HTTP methods
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   })
// );

// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   }),
// );

// app.all(
//   "/api/auth/*splat",
//   toNodeHandler(auth),
// );

// app.get("/", (_req, res) => {
//   res.json({
//     message: "Backend API is running",
//   });
// });

// app.get(
//   "/api/me",
//   async (req, res) => {
//     try {
//       const session =
//         await auth.api.getSession({
//           headers:
//             fromNodeHeaders(
//               req.headers,
//             ),
//         });

//       if (!session) {
//         return res.status(401).json({
//           message: "Unauthorized",
//         });
//       }

//       return res.json(session);
//     } catch (error) {
//       console.error(
//         "Session validation error:",
//         error,
//       );

//       return res.status(500).json({
//         message:
//           "Failed to validate session",
//       });
//     }
//   },
// );

// app.use(
//   "/api/dashboard",
//   requireAuth,
//   requirePermission({ dashboard: ["view"] }),
//   dashboardRouter,
// );

// export default app;

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "../lib/auth";
import { env } from "./config/env";
import dashboardRouter from "./routes/dashboard.routes";
import notificationRouter from "./routes/notification.routes";
import taskAssignmentRouter from "./routes/task-assignment.routes";

import {
  requireAuth,
  checkPermission,
} from "./middleware/auth-middleware";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.all(
  "/api/auth/*splat",
  toNodeHandler(auth)
);

app.get("/", (_req, res) => {
  res.json({
    message: "Backend API is running",
  });
});

app.get("/api/me", requireAuth, (_req, res) => {
  return res.json({
    ...res.locals.session,
    user: {
      ...res.locals.session.user,
      role: res.locals.user.role,
    },
  });
});

app.use(
  "/api/dashboard",
  requireAuth,
  checkPermission("dashboard:view"),
  dashboardRouter
);

app.use("/api/notifications", notificationRouter);

app.use("/api/tasks", taskAssignmentRouter);

export default app;