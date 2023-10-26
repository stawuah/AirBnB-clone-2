import { Schema, model, Types } from "mongoose";

type OTP = {
  userId: Types.ObjectId;
  token: string;
  expirationTime: number;
  created_at: Date;
};

const OTPSchema = new Schema<OTP>({
  userId: {
    // Add this field for userId
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming 'User' is the name of your user model
  },
  token: {
    type: String,
    unique: true,
  },
  expirationTime: {
    type: Number,
  },
  created_at: { type: Date, default: Date.now },
});

export const OTP = model<OTP>("OTP", OTPSchema);
