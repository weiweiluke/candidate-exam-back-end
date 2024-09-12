import { TokenExpiredError } from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';
import { Sign } from 'crypto';
import { modifyPassword, modifyProfile } from '../controllers/userController';

export const ResponseType = <T>(
  status: number,
  message: string,
  data: T | null
) => {
  return {
    status,
    message,
    data,
  };
};
export const ResponseTypeBuilder = <T>() => {
  let status = 0;
  let message = '';
  let data: T | null;
  return {
    setStatus(newStatus: number) {
      status = newStatus;
      return this;
    },
    setMessage(newMessage: string) {
      message = newMessage;
      return this;
    },
    setData(newData: T) {
      data = newData;
      return this;
    },
    SUCCESS(resType: ResponseEnumType) {
      const { status, msg } = resType;
      return this.setStatus(status).setMessage(msg);
    },
    ERROR(resType: ResponseEnumType) {
      const { status, msg } = resType;
      return this.setStatus(status).setMessage(msg);
    },
    build() {
      return ResponseType(status, message, data);
    },
  };
};

type ResType = {
  status: number;
  msg: string;
};

export const ResponseEnum: { [key: string]: ResType } = {
  CorsError: {
    status: 400,
    msg: 'Source error: CORS policy has blocked the requested resource.',
  },
  TokenNotExistError: {
    status: 401,
    msg: 'A valid authentication token is required to access this resource.',
  },
  TokenExpiredError: {
    status: 401,
    msg: 'The authentication token has expired.',
  },
  TokenInvalidError: {
    status: 402,
    msg: 'The authentication token or url is invalid. Please check the token or url and try again.',
  },
  GoogleApiError: {
    status: 403,
    msg: 'An error occurred while interacting with the Google API. Please try again later.',
  },
  EmailNotFoundError: {
    status: 404,
    msg: 'The email address does not exist.',
  },
  EmailNotVerifiedError: {
    status: 405,
    msg: 'The provided email address is either unregistered or awaiting verification. Please check your registration or verification status.',
  },
  EmailAlreadyVerifiedError: {
    status: 406,
    msg: 'No further action is required. The email address is already verified.',
  },
  UserNotFoundError: {
    status: 301,
    msg: 'User not found.',
  },
  EmailOrPasswordRequiredError: {
    status: 302,
    msg: 'To continue, please provide your username and password.',
  },
  UserAlreadyExistsError: {
    status: 303,
    msg: 'The user already exists.',
  },
  TwoPasswordSameError: {
    status: 404,
    msg: 'The new password cannot be the same as the old password.',
  },
  OldPasswordIncorrectError: {
    status: 405,
    msg: 'The old password is incorrect.',
  },
  NothingToChangeError: {
    status: 406,
    msg: 'There is nothing to change.',
  },
  GoogleUserCannotChangePasswordError: {
    status: 407,
    msg: 'You are Google users, you cannot change your password.',
  },
  EmailResendSuccess: {
    status: 0,
    msg: 'Verification email sent successfully.',
  },
  EmailVerified: {
    status: 0,
    msg: 'Thank you! Your email has been verified successfully.',
  },
  SigninSuccess: {
    status: 0,
    msg: 'Welcome! You have successfully logged in.',
  },
  SignoutSuccess: {
    status: 0,
    msg: 'User logged out successfully.',
  },
  SingupSuccess: {
    status: 0,
    msg: 'Congratulations! You have successfully registered.',
  },

  ModifyPasswordSuccess: {
    status: 0,
    msg: 'Great! Your password has been updated successfully.',
  },
  ProfileUpdateSuccess: {
    status: 0,
    msg: 'Great! Your profile has been updated successfully.',
  },
  OperationSuccess: {
    status: 0,
    msg: 'Great! Your operation was successfully completed.',
  },
  OperationFailed: {
    status: 500,
    msg: 'Oops! Something went wrong. Please try again later.',
  },
  // CorsError = '{"code": 400, "msg": "Source error: CORS policy has blocked the requested resource."}',
  // Unauthorized = '{"code": 401, "msg": "Unauthorized access."}',
  // InternalServerError = '{"code": 500, "msg": "Internal server error."}',
};

type ResponseEnumType = (typeof ResponseEnum)[keyof typeof ResponseEnum];

// export const ResponseTypeEnum: ResponseTypeEnum = {
//   CorsError: {
//     status: 400,
//     msg: 'Source error: CORS policy has blocked the requested resource.',
//   },
// };
