import express from "express";
import AuthController from "./auth.controller";
import { createUserValidator } from "../user/user.validators";
import { loginValidator } from "./auth.validators";

const AuthRouter = express.Router();

AuthRouter.post("/signup", createUserValidator, AuthController.signup);
AuthRouter.post("/login", loginValidator, AuthController.login);

export default AuthRouter;
