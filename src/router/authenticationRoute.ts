import express from "express";
import {
  register,
  login,
  logout,
  ForgortPassword,
} from "../controllers/authController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/logout", logout);
  router.get("/auth/forgotPassword", ForgortPassword);
};
