import express from "express";
import authenticationRoute from "./authenticationRoute";
const router = express.Router();

export default (): express.Router => {
  authenticationRoute(router);
  return router;
};
