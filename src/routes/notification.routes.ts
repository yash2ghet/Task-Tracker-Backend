import { Router } from "express";

import * as notificationController from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth-middleware";

const router = Router();

// Require authentication for all notification routes.
router.use(requireAuth);

// GET all notifications.
router.get("/", notificationController.notificationList);

// GET unread notification count.
router.get(
  "/unread-count",
  notificationController.notificationUnreadCount,
);

// PATCH mark notification as read.
router.patch(
  "/:id/read",
  notificationController.notificationMarkRead,
);

export default router;