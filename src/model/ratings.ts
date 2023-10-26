import { Document, Types, Schema, model } from "mongoose";

interface Rating extends Document {
  review: Types.ObjectId; // Assuming review is of type mongoose.Schema.Types.ObjectId
  rating: number;
  user: Types.ObjectId; // Assuming user is of type mongoose.Schema.Types.ObjectId
  property: Types.ObjectId; // Assuming property is of type mongoose.Schema.Types.ObjectId
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Property",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RatingModel = model<Rating>("Rating", RatingSchema);

export { RatingModel };
