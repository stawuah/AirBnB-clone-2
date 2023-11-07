import { Authenticate } from "../middleware/commonAuth";
import express from "express";
import { getPropertyRatings, addRatingToProperty } from "../controllers/rating";
const router = express.Router();

/* ------------------- Adds rating to property / --------------------- */

router.post("/addrating", addRatingToProperty);

/* ------------------- Get rating of property / --------------------- */

router.post("/getratings", getPropertyRatings);
export { router as RatingRoute };
