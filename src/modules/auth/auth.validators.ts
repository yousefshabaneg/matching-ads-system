import { check } from "express-validator";
import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";

export const loginValidator = [
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone("ar-EG")
    .withMessage("Enter a valid phone address"),
  check("password")
    .notEmpty()
    .withMessage("password field is required")
    .isLength({ min: 6 })
    .withMessage("password field must be at least 6 characters"),
  ValidatorMiddleware,
];
