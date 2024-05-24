import express from "express";
import PropertyRequestController from "./propertyRequest.controller";
import {
  createPropertyValidator,
  updatePropertyValidator,
  propertyRequestIdValidator,
} from "./propertyRequest.validators";
import AuthMiddleware from "../auth/auth.middleware";
import UserRoles from "../../shared/types/userRoles.enum";

const PropertyRequestRouter = express.Router();

PropertyRequestRouter.use(AuthMiddleware.protect);

//Clients Endpoints
PropertyRequestRouter.post(
  "/clientRequest",
  AuthMiddleware.restrictTo(UserRoles.CLIENT),
  PropertyRequestController.createPropertyRequest
);
PropertyRequestRouter.patch(
  "/clientRequest/:propertyId",
  AuthMiddleware.restrictTo(UserRoles.CLIENT),
  PropertyRequestController.updatePropertyRequestForClient
);

// Admin CRUD FOR PropertyRequest
PropertyRequestRouter.use(AuthMiddleware.restrictTo(UserRoles.ADMIN));
PropertyRequestRouter.get(
  "/",
  PropertyRequestController.getAllPropertyRequests
);

PropertyRequestRouter.route("/:id")
  .get(
    propertyRequestIdValidator,
    PropertyRequestController.getPropertyRequestById
  )
  .delete(
    propertyRequestIdValidator,
    PropertyRequestController.deletePropertyRequest
  )
  .patch(
    updatePropertyValidator,
    PropertyRequestController.updatePropertyRequest
  );

export default PropertyRequestRouter;
