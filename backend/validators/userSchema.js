import { z } from 'zod';

export const updateUserSchema = z
  .object({
    username: z
      .string({ invalid_type_error: 'Username must be a string' })
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username cannot exceed 20 characters' })
      .optional(),

    birthday: z.coerce
      .date({ invalid_type_error: 'Invalid date format' })
      .optional(),

    gender: z
      .enum(['male', 'female', 'other'], {
        invalid_type_error: 'Gender must be male, female, or other',
      })
      .optional(),
  })
  .strict();
