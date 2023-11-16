import { ReservationModel } from "../model/reservationSchema";
import { Request, Response } from "express";
import { onRequestMessage } from "../utils/Notification";
import { ReservationInput } from "../dto/customerDto";
import { plainToClass } from "class-transformer";
import { PropertyModel } from "../model/propertySchema";
import { validate } from "class-validator";
require("dotenv").config();

const createReservation = async (req: Request, res: Response) => {
  const reservationInputs = plainToClass(ReservationInput, req.body);

  const validationError = await validate(reservationInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const id = req.params.id;
  const property = await PropertyModel.findById(id);

  const { checkIn, checkOut, availability, guests, totalPrice, phone } =
    reservationInputs;
  try {
    // Create a new reservation
    const reservation = await ReservationModel.create({
      property: property._id,
      user: req.user._id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      availability,
      phone: phone,
    });

    // Save the reservation to the database
    const savedReservation = await reservation.save();
    const sendMessage = await onRequestMessage(
      phone,
      "Hello, you have just made your bookings live it love it !!"
    ).then(() => console.log("Message has been sent to the user"));

    res.status(201).json({ savedReservation, sendMessage }); // Return the saved reservation
  } catch (error) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

const getAllreservedProperty = async (req: Request, res: Response) => {
  try {
    const property = await ReservationModel.find()
      .populate({
        path: "user",
        select: "name , email",
      })
      .limit(10);

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
