import { ReservationModel } from "../model/reservationSchema";
import { Request, Response } from "express";
require("dotenv").config();

const createReservation = async (req: Request, res: Response) => {
  const { property, checkIn, checkOut, guests, totalPrice } = req.body;
  try {
    // Create a new reservation object
    const reservation = new ReservationModel({
      user: req.user._id,
      property,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    // Save the reservation to the database
    const savedReservation = await reservation.save();

    // Send Twilio message
    // twilio.messages
    //   .create({
    //     from: '<users phone number>',
    //     to: '<<user Phone number{should follow type of country code format}>>',
    //     body: `Hello, you have just made your bookings live life !!`
    //   })
    //   .then(() => console.log("Message has been sent"));

    res.status(201).json(savedReservation); // Return the saved reservation
  } catch (error) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

const getAllreservedProperty = async (req: Request, res: Response) => {
  try {
    const property = await ReservationModel.find().populate({
      path: "user",
      select: "name , email",
    });

    const reservedProperty = property.length;

    res.status(200).json({ reservedProperty, property });
  } catch (error) {
    res.status(500).json({ error: "Cannot get reserved Properties" });
  }
};

const deleteResrvation = async (req: Request, res: Response) => {
  const Id = req.params.id;

  if (Id) {
    await ReservationModel.findByIdAndDelete(Id);

    return res.json("this reserved property has been deleted").status(201);
  }

  return res.status(400).json({ msg: "Error while deleting reservation" });
};

export { createReservation, getAllreservedProperty, deleteResrvation };
