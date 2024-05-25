import dotenv from "dotenv";

dotenv.config();

const {
  API_PORT,
  NODE_ENV,
  LOG_PATH,
  DATABASE_URI,
  DATABASE_TEST,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  BASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;

const dbUri = NODE_ENV === "test" ? DATABASE_TEST : DATABASE_URI;
console.log(NODE_ENV, dbUri);

export default {
  apiPort: parseInt(API_PORT as string, 10) || 3000,
  nodeEnv: NODE_ENV?.trim().toLocaleLowerCase() ?? "development",
  loggerPath: LOG_PATH as string,
  dbUri: dbUri as string,
  defaultPageSize: parseInt(DEFAULT_PAGE_SIZE as string, 10),
  defaultPageNumber: parseInt(DEFAULT_PAGE_NUMBER as string, 10),
  baseUrl: BASE_URL as string,
  jwtSecret: JWT_SECRET || "Secret Key",
  jwtExpiration: JWT_EXPIRES_IN || "7D",
};
