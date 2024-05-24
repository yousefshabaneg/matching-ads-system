import mongoose, { Document, Model, ObjectId } from "mongoose";
import {
  PropertyTypesType,
  propertyTypesArray,
} from "../../shared/types/propertyTypes.enum";

export interface IAds extends Document {
  propertyType: PropertyTypesType;
  area: string;
  price: number;
  city: string;
  district: string;
  description: string;
  userId: ObjectId;
}

interface AdsModel extends Model<IAds> {}

const adsSchema = new mongoose.Schema<IAds, AdsModel>(
  {
    area: { type: String, required: true },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    description: { type: String },
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

adsSchema.index({ district: 1, price: 1, area: 1 });

const AdsModel = mongoose.model<IAds, AdsModel>("Ad", adsSchema);

export default AdsModel;
