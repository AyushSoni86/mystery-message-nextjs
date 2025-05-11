import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username should have atleast two characters")
  .max(20, "username should not have more than twenty characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username should not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(6, "password must be atleast six characters"),
});
