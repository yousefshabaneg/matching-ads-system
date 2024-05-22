import AppError from "../helpers/AppError";

enum PropertyTypes {
  VILLA = "VILLA",
  HOUSE = "HOUSE",
  LAND = "LAND",
  APARTMENT = "APARTMENT",
}

type PropertyTypesKeys = keyof typeof PropertyTypes;

type PropertyTypesValues = (typeof PropertyTypes)[PropertyTypesKeys];

export type PropertyTypesType = `${Capitalize<PropertyTypesValues>}`;

export const propertyTypesArray: PropertyTypesValues[] =
  Object.values(PropertyTypes);

export const validatePropertyTypes = (value: any) => {
  if (!propertyTypesArray.includes(value)) {
    throw AppError.InvalidDataException(
      `propertyType is not correct, propertyType must be one of these values: ${propertyTypesArray}`
    );
  }
  return true;
};

export default PropertyTypes;
