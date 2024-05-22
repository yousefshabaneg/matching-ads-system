import AppError from "../helpers/AppError";

enum UserStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

type UserStatusKeys = keyof typeof UserStatus;

type UserStatusValues = (typeof UserStatus)[UserStatusKeys];

export type UserStatusType = `${Capitalize<UserStatusValues>}`;

export const userStatusArray: UserStatusValues[] = Object.values(UserStatus);

export const validateStatus = (value: any) => {
  if (!userStatusArray.includes(value)) {
    throw AppError.InvalidDataException(
      `status is not correct, status must be one of these statuses: ${userStatusArray}`
    );
  }
  return true;
};

export default UserStatus;
