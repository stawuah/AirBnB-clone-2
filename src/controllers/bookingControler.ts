import { Request, Response } from "express";
import { BookingModel } from "../model/bookingSchema";
import { PropertyModel } from "../model/propertySchema";
import twilio from "twilio";
import dotenv from "dotenv";


dotenv.config();

const client = twilio(process.env.SID!, process.env.AUTH_TOKEN!);

const bookProperty = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.findOne({
      owner: req.body.owner,
      title: req.body.title,
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const bookings = await BookingModel.find({
      property: property._id,
    });

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      if (
        req.body.checkIn < booking.checkOut &&
        req.body.checkOut > booking.checkIn
      ) {
        return res
          .status(400)
          .json({ message: "Property is not available for specific dates" });
      }
    }

    const booking = new BookingModel({
      user: req.user._id,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
      property: property._id,
      guests: req.body.guests,
      totalPrice: req.body.totalPrice,
    });

    await booking.save();

    property.available = false;
    await property.save();

    res
      .status(201)
      .json({ booking, message: "Thanks for booking this property" });

    client.messages
      .create({
        from: "twilio phone number",
        to: "<users phone number>",
        body: `Hello, you have just made your bookings live it !!`,
      })
      .then((message) => console.log("Message has been sent"));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookedProperties = async (req: Request, res: Response) => {
  try {
    const allProperty = await BookingModel.find().populate({
      path: "user",
      select: "name ,  email",
    });

    res.json({ count: allProperty.length, allProperty }).status(200);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
    console.log(e);
  }
};

const updateBookedProperty = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByIdAndUpdate(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.body.checkIn) {
      booking.checkIn = req.body.checkIn;
    }
    if (req.body.checkOut) {
      booking.checkOut = req.body.checkOut;
    }
    if (req.body.guests) {
      booking.guests = req.body.guests;
    }
    if (req.body.totalPrice) {
      booking.totalPrice = req.body.totalPrice;
    }

    await booking.save();

    res.status(200).json({ booking, message: "Booking updated successfully" });

    client.messages
      .create({
        from: "twilio phone number",
        to: "<users phone number>",
        body: `Hello, you have just updated your bookings with AirBnB. live it!!`,
      })
      .then((message) => console.log("Message has been sent"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBookedProperty = async (req: Request, res: Response) => {
  try {
    await BookingModel.findByIdAndDelete(req.params.id);

    res.json("This booked property has been deleted successfully").status(201);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  bookProperty,
  getAllBookedProperties,
  deleteBookedProperty,
  updateBookedProperty,
};
