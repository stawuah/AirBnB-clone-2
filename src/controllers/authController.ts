import express from "express";
import { createUser, getUserByEmail } from "../model/userSchema";
import { OTP } from "../model/forgotPassword";
import { authentication, random } from "../utils/auth";
import { expitationAndOtp } from "../utils/otp";

export const ForgortPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;
    console.log(email);

    const existingUser = await getUserByEmail(email);

    console.log(existingUser);

    if (!existingUser) {
      res.status(401).json({ message: "Only valid credentials required" });
      return;
    }

    const otp = expitationAndOtp().otp;
    const expirationTime = new Date();
    expirationTime.setTime(new Date().getTime() + 3 * 60 * 1000); // Expire after 3 minutes

    const user = new OTP({
      userId: existingUser._id,
      token: otp,
      expirationTime: expirationTime,
    });

    console.log(user.token);

    await user.save();

    // Schedule a task to delete the OTP after 15 days
    setTimeout(async () => {
      const currentTime = Date.now() - 15 * 24 * 60 * 60 * 1000; // 15 days ago

      const expiredDocuments = await OTP.find({
        token: otp,
        expirationTime: { $lte: new Date(currentTime) }, // Find documents expired 15 days ago
      });

      const deletedDocuments = await Promise.all(
        expiredDocuments.map(async (document) => {
          await OTP.deleteOne({ _id: document._id });
          console.log(`Expired document with ID ${document._id} deleted`);
        })
      );

      console.log(`Deleted ${deletedDocuments.length} expired documents.`);
    }, 15 * 24 * 60 * 60 * 1000); // Schedule task to run after 15 days

    console.log(
      user.userId,
      "------------from expired documents--------------"
    );
    console.log(user);

    res.status(200).json({ user }).end();
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    // Clear the session token cookie
    res.clearCookie("HTINNDFKJ", {
      domain: "localhost",
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "You have been logged out successfully!",
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both email and password are required." });
    }

    const user = await getUserByEmail(email);

    if (!user.email) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist." });
    }

    const expectedHash = authentication(user.authentication.salt, password);
    console.log(expectedHash);

    if (user.authentication.password === expectedHash) {
      const sessionToken = random();

      user.authentication.sessionToken = sessionToken;
      await user.save();

      res.cookie("HTINNDFKJ", sessionToken, { domain: "localhost" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password || !name) {
      res.sendStatus(400);
    }

    const exsistingUser = await getUserByEmail(email);

    if (exsistingUser) {
      res.sendStatus(400);
    }

    const salt = random();

    const user = await createUser({
      name,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// expiredDocuments.forEach(async () => {
//   if (user._id) {
//     await delete user._id; // Delete the specific user document
//     console.log(`Expired document with ID  ${user._id} deleted`);
//   }
// });

// export const ForgortPassword = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const { email } = req.body;
//     console.log(email);
//     const exsistingUser = await getUserByEmail(email);

//     console.log(exsistingUser);

//     if (!exsistingUser) {
//       res.status(401).json({ message: "Only valid credentials required" });
//     }

//     const user = new OTP({
//       userId: exsistingUser._id,
//       token: ex().otp,
//       expirationTime: ex().expiration,
//     });

//     console.log(user.token);

//     await user.save();

//     const currentTime = Date.now() + 3 * 60 * 1000; // 1 minute in milliseconds

//     // Set the expiration time to thirty days from now
//     let expiry = new Date();
//     expiry.setTime(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds

//     const expiredDocuments = await OTP.find({
//       token: user.token,
//       expirationTime: { $eq: currentTime } && user._id && expiry,
//     });

//     // save the otp 30 days before deletion
//     expiredDocuments.forEach(async (document) => {
//       await delete document._id,
//         console.log(`Expired document with ID ${document._id} deleted`);
//     });

//     console.log(
//       user.userId,
//       expiredDocuments,
//       "------------from exired documents"
//     );
//     console.log(user);

//     res.status(200).json({ user }).end();
//   } catch (error) {
//     console.log(error);
//   }
// };
