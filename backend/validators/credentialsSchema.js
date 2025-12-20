import { z } from "zod";

export const updateCredentialsSchema = z
  .object({
    email: z
      .email({
        message: "Invalid email format",
      })
      .optional(),

    username: z
      .string({ invalid_type_error: "Username must be a string" })
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username cannot exceed 20 characters" })
      .optional(),
  })
  .optional();
