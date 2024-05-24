import mongoose, { Document, Model, ObjectId } from "mongoose";
import {
  PropertyTypesType,
  propertyTypesArray,
} from "../../shared/types/propertyTypes.enum";

export interface IPropertyRequest extends Document {
  propertyType: PropertyTypesType;
  area: string;
  price: number;
  city: string;
  district: string;
  description: string;
  refreshedAt: Date;
  userId: ObjectId;
}

interface PropertyRequestModel extends Model<IPropertyRequest> {}

const propertyRequestSchema = new mongoose.Schema<
  IPropertyRequest,
  PropertyRequestModel
>(
  {
    area: { type: String, required: true },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    description: { type: String },
    refreshedAt: { type: Date },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyType: {
      type: String,
      enum: propertyTypesArray,
      required: true,
    },
  },
  { timestamps: true }
);

propertyRequestSchema.index({ district: 1, price: 1, area: 1 });

const PropertyRequestModel = mongoose.model<
  IPropertyRequest,
  PropertyRequestModel
>("PropertyRequest", propertyRequestSchema);

export default PropertyRequestModel;
