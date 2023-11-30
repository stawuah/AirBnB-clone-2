/* ------------------- OTP --------------------- */

export const GenerateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 5 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  try {
    const accountSid = "Your Account SID from TWILIO DASHBOARD";
    const authToken = "YOUR AUTH TOKEN AS I SAID ON VIDEO";
    const client = require("twilio")(accountSid, authToken);

    const response = await client.message.create({
      body: `Your OTP is ${otp}`,
      from: "Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD",
      to: `recipient_countrycode${toPhoneNumber}`, // recipient phone number // Add country before the number
    });

    return response;
  } catch (error) {
    return false;
  }
};

/* ------------------- Notifications --------------------- */

export const onRequestMessage = async (toPhoneNumber: number, body: string) => {
  try {
    const accountSid = "Your Account SID from TWILIO DASHBOARD";
    const authToken = "YOUR AUTH TOKEN";
    const client = require("twilio")(accountSid, authToken);

    const response = await client.message.create({
      body: `Your OTP is ${body}`,
      from: "Your TWILIO PHONE NUMBER YOU CAN GET IT FROM YOUR DASHBOARD",
      to: `recipient_countrycode${toPhoneNumber}`, // recipient phone number // Add country before the number
    });

    return response;
  } catch (error) {
    return false;
  }
};

/* --------------------   otpExpirationJob -------------*/
import { User } from "../model/userSchema";

const deleteExpiredOTP = async () => {
  try {
    let currentTime = new Date();
    currentTime.setTime(currentTime.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 days ago

    const profiles = await User.find();

    for (const profile of profiles) {
      if (profile.otp_expiry <= currentTime) {
        delete profile.otp;
        await profile.save(); // Save the updated profile without OTP
      }
    }
  } catch (error) {
    console.error(error.toString());
  }
};

export default deleteExpiredOTP;
