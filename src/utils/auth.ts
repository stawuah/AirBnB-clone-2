import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const STRONG = process.env.SECRET;

export const authentication = (salt: string, password: string): String => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(STRONG)
    .digest("hex");
};

export const random = () => crypto.randomBytes(128).toString("base64");
