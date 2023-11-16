import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  image: {
    public_id: string[];
    url: string[];
  };
  password: string;
  salt: string;
  otp: number;
  otp_expiry: Date;
  phone: string;

  forgotPassword?: string; // Assuming this is of type mongoose.Schema.Types.ObjectId

  verified: boolean;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Dear customer please add a name"],
  },
  email: {
    type: String,
    required: [true, "Dear customer please add a name"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/, "Please your email"],
  },
  image: {
    public_id: {
      type: [String],
    },
    url: {
      type: [String],
    },
  },
  otp: { type: Number },
  otp_expiry: { type: Date },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  phone: { type: String, required: true },
  forgotPassword: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForgotSchema",
  },
  verified: { type: Boolean },
});

const User = model<User>("User", userSchema);

export { User };

// User Actions
export const getUsers = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({ email });
// export const getUserByEmailAndName = (email: string, name: string) =>
//   User.findOne({ email, name });
export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) =>
  new User(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  User.findByIdAndUpdate(id, values);
