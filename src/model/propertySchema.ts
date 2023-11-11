import { Document, Schema, model, Types } from "mongoose";

interface PropertyImage {
  public_id: string[];
  url: string[];
}

interface Property extends Document {
  owner: Types.ObjectId; // Assuming owner is of type mongoose.Schema.Types.ObjectId
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  image: PropertyImage;
  available: boolean;
  date: Date;
  created_at: Date;
  updated_at: Date;
  phone: number;
}

const PropertySchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "Please add a your title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Add price"],
  },
  address: {
    type: String,
    required: [true, "Add address"],
  },
  city: {
    type: String,
    required: [true, "Please add a city"],
  },
  state: {
    type: String,
    required: [true, "Please add a state"],
  },
  country: {
    type: String,
    required: [true, "Please add a country"],
  },
  zipcode: {
    type: String,
    required: [true, "Please add zip-code"],
  },
  image: {
    public_id: {
      type: [String],
    },
    url: {
      type: [String],
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  available: { type: Boolean, required: true, default: true },
  date: {
    type: Date,
    default: Date.now,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const PropertyModel = model<Property>("Property", PropertySchema);

export { PropertyModel, Property };
