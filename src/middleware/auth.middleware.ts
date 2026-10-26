
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.locals.session = session;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      message: "Failed to validate session",
    });
  }
}

export function requirePermission(permissions: Record<string, string[]>) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    const session = res.locals.session;

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions,
      },
    });

    if (!result.success) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}
