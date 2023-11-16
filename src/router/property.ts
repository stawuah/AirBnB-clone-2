import { Authenticate } from "../middleware/commonAuth";
import express from "express";
import {
  getPropertyList,
  getAllProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";
const router = express.Router();

/* ------------------- Add a property / --------------------- */

router.post("/addproperty", createProperty);
/* ------------------- Authentication --------------------- */
router.use(Authenticate);
/* ------------------- Get all property  listed/ --------------------- */
router.get("/getallproplist", getPropertyList);
/* ------------------- Get all property / --------------------- */
router.get("/getallprop", getAllProperty);

/* ------------------- UPADTE property/ --------------------- */
router.put("/updateprop", updateProperty);
/* ------------------- DELETE property --------------------- */
router.delete("/delprop", deleteProperty);
export { router as PropertyRoute };
