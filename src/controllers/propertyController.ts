import { Request, Response, NextFunction } from "express";
import { PropertyModel } from "../model/propertySchema";
import { onRequestMessage } from "../utils/Notification";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.API_KEY!,
  api_secret: process.env.API_SECRET!,
});

const client = twilio(process.env.SID!, process.env.AUTH_TOKEN!);

const getPropertyList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search_query = req.query.search_query as string;
    let properties = await PropertyModel.find({ available: true });
    if (search_query) {
      properties = await PropertyModel.find({
        $or: [
          { title: { $regex: search_query, $options: "i" } },
          { description: { $regex: search_query, $options: "i" } },
          { city: { $regex: search_query, $options: "i" } },
          { state: { $regex: search_query, $options: "i" } },
          { country: { $regex: search_query, $options: "i" } },
        ],
        available: true,
      });
    }
    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

const getAllProperty = async (req: Request, res: Response) => {
  try {
    const properties = await PropertyModel.find().populate({
      path: "owner",
      select: "name.email",
    });
    res.json({ count: properties.length, properties }).status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (imagePath: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      address,
      city,
      state,
      country,
      zipcode,
      available,
      image,
      phone,
    } = req.body;
    const imagePublic = await uploadImage(image);

    const newProperty = await PropertyModel.create({
      owner: req.user._id,
      title,
      description,
      price,
      address,
      city,
      state,
      country,
      zipcode,
      available,
      image: {
        public_id: imagePublic.public_id,
        url: imagePublic.secure_url,
      },
      phone: phone,
    });
    const sendMessage = await onRequestMessage(
      phone,
      "Hello, you have just made your bookings live it love it !!"
    );

    // client.messages
    //   .create({
    //     from: "<YOUR_TWILIO_PHONE_NUMBER>",
    //     to: "<USER_PHONE_NUMBER>",
    //     body: `Hello ${newProperty.title}, Thank you for adding your property with Hunt's. Make much and help more!`,
    //   })
    //   .then((message) => console.log("Message has been sent"));

    const savedProperty = await newProperty.save();
    res.status(201).json({ savedProperty, sendMessage });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body, updated_at: Date.now() } },
      {
        new: true,
        runValidators: true,
      }
    );
    await property?.save();

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }

  client.messages
    .create({
      from: "<YOUR_TWILIO_PHONE_NUMBER>",
      to: "<USER_PHONE_NUMBER>",
      body: `Hello, you have just updated your property with Hunt's. Make much and help more!`,
    })
    .then((message) => console.log("Message has been sent"));
};

const deleteProperty = async (req: Request, res: Response) => {
  try {
    await PropertyModel.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(201).json({ message: "Property deleted" });
  } catch (error) {
    res.status(403).send("Hello, you are forbidden to enter");
  }
};

export {
  getPropertyList,
  getAllProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
