import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import {
  mongoIdChain,
  stringChain,
} from "../../shared/helpers/validatorsChains";
import { check } from "express-validator";
import { validatePropertyTypes } from "../../shared/types/propertyTypes.enum";

export const propertyRequestIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createPropertyValidator = [
  check("propertyType")
    .notEmpty()
    .withMessage("propertyType is required")
    .custom(validatePropertyTypes),

  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price is not correct"),

  check("refreshedAt").optional(),

  mongoIdChain("userId"),
  stringChain("area"),
  stringChain("city"),
  stringChain("district"),
  stringChain("description"),
  ValidatorMiddleware,
];

export const updatePropertyValidator = [
  mongoIdChain(),

  check("price").optional().isNumeric().withMessage("price is not correct"),

  stringChain("area").optional(),
  stringChain("description").optional(),

  ValidatorMiddleware,
];
