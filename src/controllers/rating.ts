import { Request, Response, NextFunction } from "express";
import { PropertyModel } from "../model/propertySchema";
import { RatingModel } from "../model/ratings";

// Get ratings for a property
const getPropertyRatings = async (req: Request, res: Response) => {
  try {
    const Id = req.params.id;

    // Check if the property exists
    const property = await PropertyModel.findById(Id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const ratings = await RatingModel.find({ property: Id });
    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a rating to a property
const addRatingToProperty = async (req: Request, res: Response) => {
  const { rating } = req.body;
  const Id = req.params.id;

  try {
    // Check if the property exists
    const property = await PropertyModel.findById(Id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newRating = new RatingModel({
      property: Id,
      rating,
      user: req.user._id, // Assuming you have authentication and the current user is available in req.user
    });

    const savedRating = await newRating.save();
    res
      .status(201)
      .json({
        rating: savedRating,
        message: "Rating added to property successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getPropertyRatings, addRatingToProperty };
