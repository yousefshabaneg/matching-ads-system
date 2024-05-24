import { Application, NextFunction, Request, Response } from "express";
import express from "express";
import path from "path";
import cors from "cors";
import AppError from "./shared/helpers/AppError";
import globalErrorHandler from "./shared/middlewares/error.middleware";
import UserRouter from "./modules/user/user.route";
import AuthRouter from "./modules/auth/auth.route";
import PropertyRequestRouter from "./modules/propertyRequest/propertyRequest.route";
import AdsRouter from "./modules/ads/ads.route";

class App {
  public express: Application;
  public ROOT_DIR = path.resolve(__dirname);

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.errorHandlingRoutes();
  }

  private middleware(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  private routes(): void {
    this.express.use("/property", PropertyRequestRouter);
    this.express.use("/ads", AdsRouter);
    this.express.use("/auth", AuthRouter);
    this.express.use("/user", UserRouter);
  }

  private errorHandlingRoutes(): void {
    this.express.all("*", (req: Request, res: Response, next: NextFunction) => {
      const err = AppError.NotFoundException(
        `Can't find ${req.originalUrl} resource on the server`
      );
      next(err);
    });
    this.express.use(globalErrorHandler);
  }
}

export default new App().express;
