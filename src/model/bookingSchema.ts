import { Schema, model, Types } from "mongoose";

interface Booking {
  user: Types.ObjectId;
  property: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

const BookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BookingModel = model<Booking>("Booking", BookingSchema);

export { BookingModel }; // Correct export statement
