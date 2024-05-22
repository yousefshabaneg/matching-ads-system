import { Request } from "express";
import "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: any;
    filterObject?: any;
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    user?: any;
  }
}
