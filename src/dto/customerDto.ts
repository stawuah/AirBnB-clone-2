import { IsEmail, Length } from "class-validator";

export interface CustomerPayload {
  [x: string]: any;
  _id: string;
  email: string;
  phone?: string;
  verified: boolean;
}

export class UserLoginInput {
  @IsEmail()
  email: string;

  @Length(1, 12)
  password: string;
}

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(1, 12)
  password: string;

  name: string;
}
export class ReservationInput {
  checkIn: Date;

  checkOut: Date;

  availability: boolean;

  @Length(4, 6)
  guests: number;

  totalPrice: number;

  @Length(7, 12)
  phone: string;
}
