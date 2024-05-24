import express from "express";
import AdsController from "./ads.controller";
import {
  createAdsValidator,
  updateAdsValidator,
  adsIdValidator,
} from "./ads.validators";
import AuthMiddleware from "../auth/auth.middleware";
import UserRoles from "../../shared/types/userRoles.enum";

const AdsRouter = express.Router();

AdsRouter.use(AuthMiddleware.protect);

AdsRouter.get(
  "/match/:adId",
  AuthMiddleware.restrictTo(UserRoles.AGENT),
  AdsController.getMatchedProperties
);

AdsRouter.post(
  "/",
  AuthMiddleware.restrictTo(UserRoles.AGENT),
  createAdsValidator,
  AdsController.createAd
);

// All routes down will be available for admins only
AdsRouter.use(AuthMiddleware.restrictTo(UserRoles.ADMIN));

AdsRouter.get("/", AdsController.getAllAds);

AdsRouter.route("/:id")
  .get(adsIdValidator, AdsController.getAdById)
  .delete(adsIdValidator, AdsController.deleteAd)
  .patch(updateAdsValidator, AdsController.updateAd);

export default AdsRouter;
