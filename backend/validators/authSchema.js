import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.email({ message: "Invalid email" }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
  })
  .optional();

export const signinSchema = z
  .object({
    email: z.email({ message: "Invalid email" }).optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
  })
  .optional();
