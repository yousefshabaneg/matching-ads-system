import custom from "../../shared/types/custom";
import mongoose, { Document, Model, ObjectId } from "mongoose";
import UserRoles, {
  userRoleArray,
  UserRoleType,
} from "../../shared/types/userRoles.enum";
import config from "../../shared/config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import validator from "validator";
import bcryptjs from "bcryptjs";
import AppError from "../../shared/helpers/AppError";
import UserStatus, {
  UserStatusType,
  userStatusArray,
} from "../../shared/types/userStatus.enum";

export interface IUser extends Document {
  name: string;
  phone: string;
  password?: string;
  role: UserRoleType;
  status: UserStatusType;
  correctPassword(candidatePassword: string): Promise<boolean>;
  generateToken(): Promise<string>;
}

interface UserModel extends Model<IUser> {
  login: (email: string, password: string) => Promise<any>;
  verifyToken: (token: string) => Promise<JwtPayload>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    phone: {
      type: String,
      required: [true, "phone required"],
      unique: true,
      lowercase: true,
      validate: [
        (str: string) => validator.isMobilePhone(str, "ar-EG"),
        "Please provide a valid phone",
      ],
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: userRoleArray,
      default: UserRoles.CLIENT,
    },
    status: {
      type: String,
      enum: userStatusArray,
      default: UserStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password!, 12);
  next();
});

userSchema.pre<any>(/^find/, function (next) {
  this.find({ status: UserStatus.ACTIVE });
  next();
});

userSchema.statics.login = async (phone, password) => {
  // check if user is exist.
  const user = await UserModel.findOne({ phone }).select("+password");
  if (!user) throw AppError.NotFoundException("User doest not exist");

  // validate password.
  const checkPassword = await user.correctPassword(password);
  if (!checkPassword)
    throw AppError.NotAuthenticatedException("Wrong Password, try again...");

  //delete password
  delete user.password;
  return user;
};

userSchema.methods.correctPassword = async function (
  candidatePassword: string
) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = async function () {
  const user = { phone: this.phone, id: this._id, role: this.role };

  const token = jwt.sign({ user }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  return token;
};

userSchema.statics.verifyToken = async function (token): Promise<JwtPayload> {
  if (!token) throw AppError.InvalidDataException("Token is required");
  const decodedToken = jwt.verify(token, config.jwtSecret) as JwtPayload;
  if (!decodedToken.user)
    throw AppError.NotFoundException("User doest not exist");

  return decodedToken;
};

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.__v;
  delete data.password;
  delete data.createdAt;
  delete data.updatedAt;
  return data;
};

const UserModel = mongoose.model<IUser, UserModel>("User", userSchema);

export default UserModel;
