import express from "express";
import UserController from "./user.controller";
import {
  userIdValidator,
  createUserValidator,
  updateUserValidator,
} from "./user.validators";
import AuthMiddleware from "../auth/auth.middleware";
import UserRoles from "../../shared/types/userRoles.enum";

const UserRouter = express.Router();

UserRouter.use(AuthMiddleware.protect);
UserRouter.use(AuthMiddleware.restrictTo(UserRoles.ADMIN));

UserRouter.get("/stats", UserController.stats);

UserRouter.route("/")
  .get(UserController.getAllUsers)
  .post(createUserValidator, UserController.createUser);

UserRouter.route("/:id")
  .get(userIdValidator, UserController.getUserById)
  .delete(userIdValidator, UserController.deleteUser)
  .patch(updateUserValidator, UserController.updateUser);

export default UserRouter;
