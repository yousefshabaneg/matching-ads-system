import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain, nameChain } from "../../shared/helpers/validatorsChains";
import { check } from "express-validator";
import UserModel from "./user.model";
import AppError from "../../shared/helpers/AppError";
import { validateRole } from "../../shared/types/userRoles.enum";
import { validateStatus } from "../../shared/types/userStatus.enum";

export const userPhoneValidator = () => {
  return check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone("ar-EG")
    .withMessage("Enter a valid phone address");
};

const userPasswordValidator = () => {
  return check("password")
    .notEmpty()
    .withMessage("password field is required")
    .isLength({ min: 6 })
    .withMessage("password field must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw AppError.InvalidDataException(
          "password and passwordConfirm are not match"
        );
      }
      return true;
    });
};

export const userIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createUserValidator = [
  nameChain(),
  userPhoneValidator(),
  userPasswordValidator(),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm field is required"),

  check("role").optional().custom(validateRole),
  check("status").optional().custom(validateStatus),
  ValidatorMiddleware,
];

export const updateUserValidator = [
  mongoIdChain(),
  nameChain().optional(),
  ValidatorMiddleware,
];
