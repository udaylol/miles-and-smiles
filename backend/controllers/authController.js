import AuthService from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";
import { sendResponse } from "../utils/response.js";

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

class AuthController {
  // ------------------- SIGNUP -------------------
  static async signup(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return sendResponse(res, 400, false, "Email and password required.");
      }

      const user = await AuthService.signup(email, password);

      const token = generateToken(user.id);
      setAuthCookie(res, token);

      return sendResponse(res, 201, true, "Signup successful.", {
        user,
        token,
      });
    } catch (err) {
      console.error("signup error:", err);
      
      if (err.message === "Email is already in use.") {
        return sendResponse(res, 400, false, err.message);
      }
      
      return sendResponse(res, 500, false, "Sign up failed.");
    }
  }

  // ------------------- SIGNIN -------------------
  static async signin(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return sendResponse(res, 400, false, "Email and password required.");
      }

      const user = await AuthService.signin(email, password);

      const token = generateToken(user.id);
      setAuthCookie(res, token);

      return sendResponse(res, 200, true, "Signin successful.", {
        user,
        token,
      });
    } catch (err) {
      console.error("signin error:", err);
      
      if (err.message === "Invalid email or password.") {
        return sendResponse(res, 400, false, err.message);
      }
      
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ------------------- SIGNOUT -------------------
  static async signout(req, res) {
    res.clearCookie("token");
    return sendResponse(res, 200, true, "Signed out successfully.");
  }
}

export default AuthController;