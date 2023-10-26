import crypto from "crypto";

interface OtpExpiration {
  expiration: number;
  otp: string;
}

const OneTimePassword = () => crypto.randomBytes(2).toString("hex");
const Expiration = () => Date.now() + 3 * 60 * 1000;

export function expitationAndOtp(): OtpExpiration {
  return { expiration: Expiration(), otp: OneTimePassword() };
}
