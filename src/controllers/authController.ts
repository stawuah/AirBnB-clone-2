import express from "express";
import { createUser, getUserByEmail } from "../model/userSchema";
import { authentication, random } from "../utils/auth";

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
