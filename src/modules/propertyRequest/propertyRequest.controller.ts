import AppError from "../../shared/helpers/AppError";
import catchAsync from "../../shared/helpers/catchAsync";
import ApiFactory from "../../shared/services/ApiFactory.service";
import HelperFunctions from "../../shared/services/HelperFunctions.service";
import ApiStatus from "../../shared/types/apiStatus.enum";
import PropertyRequestModel from "./propertyRequest.model";

class PropertyRequestController {
  static propertyRequestFactory = new ApiFactory(
    "propertyRequestController",
    PropertyRequestModel
  );

  static updatePropertyRequestForClient = catchAsync(async (req, res, next) => {
    const { propertyId } = req.params;
    const payload = HelperFunctions.selectFieldsFromObject(
      req.body,
      "description",
      "area",
      "price"
    );

    const clientId = req.user.id;

    const propertyRequest = await PropertyRequestModel.findOneAndUpdate(
      {
        _id: propertyId,
        userId: clientId,
      },
      payload,
      { new: true }
    );

    if (!propertyRequest) {
      throw AppError.NotFoundException("This property does not exist");
    }

    return res.status(200).json({
      status: ApiStatus.SUCCESS,
      data: propertyRequest,
    });
  });

  static createPropertyRequest = this.propertyRequestFactory.createOne();

  static getAllPropertyRequests = this.propertyRequestFactory.getAll();
  static getPropertyRequestById = this.propertyRequestFactory.getOne();
  static updatePropertyRequest = this.propertyRequestFactory.updateOne();
  static deletePropertyRequest = this.propertyRequestFactory.deleteOne();
}

export default PropertyRequestController;
