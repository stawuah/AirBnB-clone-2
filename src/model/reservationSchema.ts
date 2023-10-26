import { Document, Types, Schema, model } from "mongoose";

interface Reservation extends Document {
  user: Types.ObjectId; // Assuming user is of type mongoose.Schema.Types.ObjectId
  property: Types.ObjectId; // Assuming property is of type mongoose.Schema.Types.ObjectId
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const ReservationSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  createdAt: { type: Date, default: Date.now },
});

const ReservationModel = model<Reservation>("Reservation", ReservationSchema);

export { ReservationModel };
