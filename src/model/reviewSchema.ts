import { Document, Schema, Types, model } from "mongoose";

interface Review extends Document {
  title: string;
  description: string;
  user: Types.ObjectId; // Assuming user is of type mongoose.Schema.Types.ObjectId
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewModel = model<Review>("Review", ReviewSchema);

export { ReviewModel };
