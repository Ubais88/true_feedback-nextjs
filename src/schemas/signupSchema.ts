import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be not more than 20 characters");


export const signUpSchema = z.object({
    username: usernameValidation,
    email:z.string().email({message: "Please enter your valid email address"}),
    password: z.string().min(6 , {message: "Please enter your valid password"})
})