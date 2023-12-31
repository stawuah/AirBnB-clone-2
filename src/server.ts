import express, { Router } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import connectDB from "./config/connect";
import { AuthRoute } from "./router/authenticationRoute";
import { RatingRoute } from "./router/ratings";
import { ReservationRoute } from "./router/reservations";
import { BookingRoute } from "./router/booking";
import { PropertyRoute } from "./router/property";
import deleteExpiredOTP from "./utils/Notification";
const PORT = process.env.PORT
connectDB();
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/auth", AuthRoute);
app.use("/rate", RatingRoute);
app.use("/resprop", ReservationRoute);
app.use("/bookprop", BookingRoute);
app.use("/property", PropertyRoute);
const server = http.createServer(app);

// Schedule a task to delete the OTP after 15 days as Background job
setInterval(async () => {
  await deleteExpiredOTP();
}, 15 * 24 * 60 * 60 * 1000);

server.listen(PORT, () => {
  console.log(`sever is listening on http://localhost:${PORT}/`);
});
