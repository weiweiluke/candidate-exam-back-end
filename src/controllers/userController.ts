import { Request, Response } from 'express';
import { ResponseEnum, ResponseTypeBuilder } from '../utils/responseFormatter';
import { SignInReq, SignInRes } from '../types/httpEntity';
import {
  findUserByEmail as findUserByEmailService,
  createUser as createUserService,
  updateUserName,
  updateUserPassword,
} from '../services/userService';
import {
  loginUser as signInUserService,
  sendVerificationEmail,
} from '../services/authService';
import User from '../models/User';
import bcrypt from 'bcrypt';

/**
 * Registers a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Response} The response containing the user information and token.
 */
export const signUpUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if the username and password are provided
  if (!email || !password) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.EmailOrPasswordRequiredError)
          .build()
      );
  }

  // Check if the user already exists
  const existingUser = await findUserByEmailService(email);
  if (existingUser) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.UserAlreadyExistsError)
          .build()
      );
  }

  // Create a new user
  const newUser = await createUserService(
    User.build({
      email,
      password,
      firstName: '',
      lastName: '',
      isGoogleRegistered: false,
      isEmailVerified: false,
      permission: [],
      username: '',
      lastSession: new Date(),
      loginCount: 1,
    })
  );
  if (!newUser) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>().ERROR(ResponseEnum.OperationFailed).build()
      );
  }
  // Log in the user
  let token: string = '';
  if (newUser) {
    sendVerificationEmail(newUser.email);
    const { token: returnedToken } = await signInUserService(email, password);
    token = returnedToken;
  }
  // Return the user information and the token
  return res
    .status(200)
    .json(
      ResponseTypeBuilder<SignInRes>()
        .SUCCESS(ResponseEnum.SingupSuccess)
        .setData({ accessToken: token, refreshToken: token, user: newUser })
        .build()
    );
};

/**
 * Logs in a user.
 *
 * @param req - The request object containing the user's sign-in information.
 * @param res - The response object to send the result of the login operation.
 * @returns A JSON response with the user's access token, refresh token, and user information if the login is successful. Otherwise, an error response is returned.
 */
export const signInUser = async (req: SignInReq, res: Response) => {
  const { email, password } = req.body;

  // Check if the Email and password are provided
  if (!email || !password) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.EmailOrPasswordRequiredError)
          .build()
      );
  }

  try {
    const { token, user } = await signInUserService(email, password);

    const responseBody = ResponseTypeBuilder<SignInRes>()
      .SUCCESS(ResponseEnum.SigninSuccess)
      .setData({ accessToken: token, refreshToken: token, user: user })
      .build();

    return res.status(200).json(responseBody);
  } catch (error: any) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>().ERROR(ResponseEnum.OperationFailed).build()
      );
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token');
  res
    .status(200)
    .json(
      ResponseTypeBuilder<null>()
        .SUCCESS(ResponseEnum.SignoutSuccess)
        .setData(null)
        .build()
    );
};

export const modifyPassword = async (req: Request, res: Response) => {
  // check if the user is logged in
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.TwoPasswordSameError)
          .build()
      );
  }

  if (!user) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.UserNotFoundError)
          .build()
      );
  }
  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder<null>()
            .ERROR(ResponseEnum.OldPasswordIncorrectError)
            .build()
        );
    }
    await updateUserPassword(user, newPassword);

    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .SUCCESS(ResponseEnum.PasswordChangeSuccess)
          .build()
      );
  } catch (error) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>().ERROR(ResponseEnum.OperationFailed).build()
      );
  }
};
export const modifyProfile = async (req: Request, res: Response) => {
  // check if the user is logged in
  const user = req.user;
  const { lastName, firstName } = req.body;

  if (!user) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.UserNotFoundError)
          .build()
      );
  }
  if (user.firstName === firstName && user.lastName === lastName) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<null>()
          .ERROR(ResponseEnum.NothingToChangeError)
          .build()
      );
  }
  user.firstName = firstName;
  user.lastName = lastName;

  try {
    const updatedUser = await updateUserName(user, firstName, lastName);
    // update the user profile in the database
    res
      .status(200)
      .json(
        ResponseTypeBuilder<User>()
          .SUCCESS(ResponseEnum.ProfileUpdateSuccess)
          .setData(updatedUser)
          .build()
      );
  } catch (error) {
    res
      .status(200)
      .json(
        ResponseTypeBuilder<null>().ERROR(ResponseEnum.OperationFailed).build()
      );
  }
};
