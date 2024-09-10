import User from '../models/User';
import { Request } from 'express';
export interface SignInReq extends Request {
  body: {
    email: string;
    password: string;
  };
}
export interface SignUpReq extends Request {
  body: {
    email: string;
    password: string;
  };
}
export interface SignInRes {
  accessToken: string;
  refreshToken: string;
  user: User;
}
