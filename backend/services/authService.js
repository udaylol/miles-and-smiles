import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { publicUserDTO } from "../dtos/userDto.js";

class AuthService {
  /**
   * Create a new user account
   * @throws Error if email already exists
   */
  static async signup(email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    return publicUserDTO(user);
  }

  /**
   * Authenticate user credentials
   * @throws Error if credentials are invalid
   */
  static async signin(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    return publicUserDTO(user);
  }
}

export default AuthService;