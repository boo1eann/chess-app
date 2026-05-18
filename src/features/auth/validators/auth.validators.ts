import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/shared/validators/primitives";
import z from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Login is required")
    .max(255, "Login is too long")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
  deviceName: z.string().min(1).max(255).optional(),
  deviceType: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

export const RegisterSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  deviceName: z.string().min(1).max(255).optional(),
  deviceType: z.enum(["mobile", "tablet", "desktop"]).optional(),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
