import { Authenticate } from "../middleware/commonAuth";
import express from "express";
import {
  createReservation,
  getAllreservedProperty,
  deleteResrvation,
} from "../controllers/reservation";
const router = express.Router();

/* ------------------- Create a reservation for a property / --------------------- */

router.post("/createreserve", createReservation);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Get reserved of property / --------------------- */

router.get("/getreserved", getAllreservedProperty);
/* ------------------- deletion of property  --------------------- */
router.get("/delreserved/:id", deleteResrvation);
export { router as ReservationRoute };
