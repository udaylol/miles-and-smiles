import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { sendResponse } from "../utils/response.js";
import { publicUserDTO } from "../dtos/userDto.js";

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

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendResponse(res, 400, false, "Email is already in use.");
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword,
      });
      await user.save();

      const token = generateToken(user._id);
      setAuthCookie(res, token);

      return sendResponse(res, 201, true, "Signup successful.", {
        user: publicUserDTO(user),
        token,
      });
    } catch (err) {
      console.error("signup error:", err);
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

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return sendResponse(res, 400, false, "Invalid email or password.");
      }

      const isMatch = await comparePassword(password, existingUser.password);
      if (!isMatch) {
        return sendResponse(res, 400, false, "Invalid email or password.");
      }

      const token = generateToken(existingUser._id);
      setAuthCookie(res, token);

      return sendResponse(res, 200, true, "Signin successful.", {
        user: publicUserDTO(existingUser),
        token,
      });
    } catch (err) {
      console.error("signin error:", err);
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
