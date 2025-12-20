import { verifyToken } from "../utils/jwt.js";
import { sendResponse } from "../utils/response.js";

export const auth = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return sendResponse(res, 401, false, "Not authenticated");
    }

    const decoded = verifyToken(token);

    req.user = { id: decoded._id };
    next();
  } catch (err) {
    console.error("Authentication error:", err);

    return sendResponse(res, 401, false, "Token invalid or expired");
  }
};
