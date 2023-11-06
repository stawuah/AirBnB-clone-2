import { IsEmail, Length } from "class-validator";

export interface CustomerPayload {
  [x: string]: any;
  _id: string;
  email: string;
  verified: boolean;
}

export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}
