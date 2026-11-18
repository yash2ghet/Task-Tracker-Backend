import { Router } from "express";

import * as taskAssignmentController from "../controllers/task-assignment.controller";

import {
  requireAuth,
  checkPermission,
} from "../middleware/auth-middleware";

const router = Router();

router.patch(
  "/:id/assign",
  requireAuth,
  checkPermission("task:update"),
  taskAssignmentController.assignTask,
);

export default router;