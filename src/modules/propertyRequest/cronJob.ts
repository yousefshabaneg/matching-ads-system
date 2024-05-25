import LoggerService from "../../shared/services/Logger.service";
import PropertyRequestModel from "./propertyRequest.model";
import cron from "node-cron";
const logger = new LoggerService("cronJob");

cron.schedule("0 0 */3 * *", async () => {
  try {
    const currentDate = new Date();
    const result = await PropertyRequestModel.updateMany(
      {},
      { $set: { refreshedAt: currentDate } }
    );
    logger.log(
      "info",
      `Cron job executed: ${result.modifiedCount} property requests refreshed`
    );
  } catch (error) {
    logger.log("error", "Error refreshing property requests:", error);
  }
});

logger.log("info", "cron job that refresh property requests every 3 days");
