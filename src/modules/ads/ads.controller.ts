import AppError from "../../shared/helpers/AppError";
import catchAsync from "../../shared/helpers/catchAsync";
import ApiFactory from "../../shared/services/ApiFactory.service";
import HelperFunctions from "../../shared/services/HelperFunctions.service";
import ApiStatus from "../../shared/types/apiStatus.enum";
import PropertyRequestModel from "../propertyRequest/propertyRequest.model";
import AdsModel from "./ads.model";

class AdsController {
  static adsFactory = new ApiFactory("adsController", AdsModel);

  // For admin only
  static getAllAds = this.adsFactory.getAll();
  static getAdById = this.adsFactory.getOne();
  static createAd = this.adsFactory.createOne();
  static updateAd = this.adsFactory.updateOne();
  static deleteAd = this.adsFactory.deleteOne();

  // for agents only
  static getMatchedProperties = catchAsync(async (req, res, next) => {
    const { adId } = req.params;
    const ad = await AdsModel.findById(adId);
    if (!ad) {
      throw AppError.NotFoundException("Ad id is not found");
    }

    // Get price tolerance for this ad
    const { maxPrice, minPrice } = HelperFunctions.getMinAndMaxPriceTolerance(
      ad.price
    );

    const matchCondition = {
      district: ad.district,
      area: ad.area,
      price: { $gte: minPrice, $lte: maxPrice },
    };

    const pagination = await HelperFunctions.getPaginationFromQueryAndModel(
      req.query,
      PropertyRequestModel,
      matchCondition
    );

    const propertyRequests = await PropertyRequestModel.aggregate([
      {
        $match: matchCondition,
      },
      {
        $sort: { refreshedAt: -1 },
      },
      {
        $skip: pagination.skip,
      },
      {
        $limit: pagination.limit,
      },
    ]);
    return res.status(200).json({
      status: ApiStatus.SUCCESS,
      data: propertyRequests,
      page: pagination.currentPage,
      limit: pagination.limit,
      total: pagination.total,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
    });
  });
}

export default AdsController;
