import { Document, Schema, model } from "mongoose";

interface ForgotPassword extends Document {
  name: string;
  email: string;
  token?: string;
}

const ForgotPasswordSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});

const ForgotPasswordModel = model<ForgotPassword>(
  "ForgotPassword",
  ForgotPasswordSchema
);

export { ForgotPasswordModel };
