import UserModel from "./user.model";
import ApiFactory from "../../shared/services/ApiFactory.service";
import catchAsync from "../../shared/helpers/catchAsync";
import HelperFunctions from "../../shared/services/HelperFunctions.service";
import UserRoles from "../../shared/types/userRoles.enum";
import UserStatus from "../../shared/types/userStatus.enum";

class UserController {
  static userFactory = new ApiFactory("userController", UserModel);

  static getAllUsers = this.userFactory.getAll();
  static getUserById = this.userFactory.getOne();
  static createUser = this.userFactory.createOne();
  static updateUser = this.userFactory.updateOne();
  static deleteUser = this.userFactory.deleteOne();

  static stats = catchAsync(async (req, res, next) => {
    const pagination = await HelperFunctions.getPaginationFromQueryAndModel(
      req.query,
      UserModel,
      {
        role: { $in: [UserRoles.AGENT, UserRoles.CLIENT] },
      }
    );

    const users = await UserModel.aggregate([
      {
        $match: {
          role: { $in: [UserRoles.CLIENT, UserRoles.AGENT] },
          status: UserStatus.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "userId",
          as: "ads",
        },
      },
      {
        $lookup: {
          from: "propertyrequests",
          localField: "_id",
          foreignField: "userId",
          as: "requests",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          role: 1,
          status: 1,
          adsCount: { $size: "$ads" },
          totalAdsAmount: { $sum: "$ads.price" },
          requestsCount: { $size: "$requests" },
          totalRequestsAmount: { $sum: "$requests.price" },
        },
      },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
    ]);

    return res.status(200).json({
      data: users,
      page: pagination.currentPage,
      limit: pagination.limit,
      total: pagination.total,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
    });
  });
}

export default UserController;
