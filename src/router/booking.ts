import { Authenticate } from "../middleware/commonAuth";
import express from "express";
import {
  bookProperty,
  getAllBookedProperties,
  deleteBookedProperty,
  updateBookedProperty,
} from "../controllers/bookingControler";
const router = express.Router();

/* ------------------- Create a boooking for a property / --------------------- */

router.post("/bookproperty", bookProperty);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Get all booked property / --------------------- */

router.get("/getbooked", getAllBookedProperties);
/* ------------------- deletion of booked property  --------------------- */
router.get("/delbookedproperty/:id", deleteBookedProperty);

router.put("/updatebookedprop", updateBookedProperty);
export { router as BookingRoute };
