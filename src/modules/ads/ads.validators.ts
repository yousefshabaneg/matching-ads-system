import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import {
  mongoIdChain,
  stringChain,
} from "../../shared/helpers/validatorsChains";
import { check } from "express-validator";
import { validatePropertyTypes } from "../../shared/types/propertyTypes.enum";

export const adsIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createAdsValidator = [
  check("propertyType")
    .notEmpty()
    .withMessage("propertyType is required")
    .custom(validatePropertyTypes),

  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price is not correct"),

  mongoIdChain("userId"),
  stringChain("area"),
  stringChain("city"),
  stringChain("district"),
  stringChain("description"),
  ValidatorMiddleware,
];

export const updateAdsValidator = [
  mongoIdChain(),

  check("price").optional().isNumeric().withMessage("price is not correct"),
  stringChain("area"),
  stringChain("description"),

  ValidatorMiddleware,
];
