// import express from "express";
import { getUserByEmail } from "../model/userSchema";

import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CreateCustomerInput, UserLoginInput } from "../dto/customerDto";
import { User } from "../model/userSchema";

import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  ValidatePassword,
} from "../utils/index";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, phone, password, name } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existingCustomer = await getUserByEmail(email);

  if (existingCustomer) {
    return res
      .status(400)
      .json({ message: "Email already exists, please use a different email" });
  }
  const result = await new User({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    name,
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {

    await onRequestOTP(otp, phone);

    //Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });


    return res.status(201).json({
      signature,
      verified: result.verified,
      email: result.email,
      result,
    });
  }

  return res.status(400).json({ msg: "Error while creating user" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const customer = await User.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
    }
  }

  return res.json({ msg: "Error With Signup" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await User.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(200).json({
          signature,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
      }
    }
  }

  return res.status(400).json({ msg: "Unable to verify Customer" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await User.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      const sendCode = await onRequestOTP(otp, profile.phone);

      if (!sendCode) {
        return res
          .status(400)
          .json({ message: "Failed to verify your phone number" });
      }

      return res
        .status(200)
        .json({ message: "OTP sent to your registered Mobile Number!" });
    }
  }

  return res.status(400).json({ msg: "Error with Requesting OTP" });
};

const ForgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log(email);

    const existingUser = await getUserByEmail(email);

    console.log(existingUser);

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Only valid credentials required" });
    }

    const profile = await User.findById(existingUser._id);

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const { otp, expiry } = GenerateOtp();
    profile.otp = otp;
    profile.otp_expiry = expiry;

    const sendCode = await onRequestOTP(otp, profile.phone);

    if (!sendCode) {
      return res.status(400).json({
        message: "Failed to verify your phone number to send you your code",
      });
    }

    await profile.save();
  } catch (error: any) {
    console.error(error.toString());
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {

     const userId = req.params.id;
    
     if (userId) {
      const decodedTokenUser = await User.findById(userId);

       res.clearCookie("token", {
      domain: "localhost",
      sameSite: "*",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "You have been logged out successfully!",
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
      {
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  RequestOtp,
  ForgotPassword,
  logout,
};
