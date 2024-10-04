import { z } from "zod";
import { USER_ROLE, USER_STATUS } from "./user.constant";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    // Optional role with a default to USER_ROLE.USER
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Invalid email",
      }),
    // Password with minimum length validation for security
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
    // Status defaulting to active if not provided
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
    mobileNumber: z
      .string()
      .optional()
      // .regex(/^\d{10,15}$/, "Invalid mobile number format")
      .optional(),
  }),
});

// const updateUserValidationSchema = z.object({
//   body: z.object({
//     name: z.string().optional(),
//     role: z.nativeEnum(USER_ROLE).optional(),
//     // Email and password should follow proper validation even when optional
//     email: z
//       .string()
//       .email({
//         message: "Invalid email format",
//       })
//       .optional(),
//     password: z
//       .string()
//       .min(6, "Password must be at least 6 characters long")
//       .optional(),
//     status: z.nativeEnum(USER_STATUS).optional(),
//     mobileNumber: z.string().optional().optional(),
//   }),
// });
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().optional(),
    profilePicture: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
