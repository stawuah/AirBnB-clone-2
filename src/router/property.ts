import express from "express";
import {
  getPropertyList,
  getAllProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

/* -------------------  Search property --------------------- */
router.get("/propertylist", getPropertyList);

/* ------------------- all property --------------------- */
router.get("/allproperty", getAllProperty);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- update property --------------------- */
router.patch("/updateproperty/:id ", updateProperty);

/* -------------------  delete proper --------------------- */
router.delete("/deleteproperty/:id", deleteProperty);

export { router as PropertyRoute };
