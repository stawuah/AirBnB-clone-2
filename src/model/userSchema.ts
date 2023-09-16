import { Schema, InferSchemaType } from "mongoose";
import mongoose from "mongoose";

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
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

type User = InferSchemaType<typeof userSchema>;

export const User = mongoose.model("User", userSchema);

// User Actions
export const getUsers = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  User.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string, any>) =>
  new User(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  User.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  User.findByIdAndUpdate(id, values);
