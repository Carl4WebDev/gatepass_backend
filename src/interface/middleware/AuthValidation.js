import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .escape(),
];
