import { getAuthenticatedClient } from '../utils/googleAuthClientUtil';
import { Request, Response } from 'express';
import { ResponseEnum, ResponseTypeBuilder } from '../utils/responseFormatter';
import crypto from 'crypto';
import { Session } from 'express-session';
import User from '../models/User';
import {
  createUser,
  findUserByEmail,
  updateUserEmailVerification,
} from '../services/userService';
import {
  loginUser,
  sendVerificationEmail,
  verifyEmailToken,
} from '../services/authService';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Add this line to import the 'jwt' module
import config from '../config/config';

interface SessionAntiCSRF extends Session {
  state?: string;
}
/**
 * Generates the Google authentication URL.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to void.
 */
export const getGoogleAuthUrl = async (req: Request, res: Response) => {
  try {
    const oAuth2Client = await getAuthenticatedClient();

    const state = crypto.randomBytes(32).toString('hex');
    (req.session as SessionAntiCSRF).state = state;
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      state: state,
    });
    res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .setStatus(0)
          .setData({ url: authorizeUrl })
          .build()
      );
  } catch (error: any) {
    res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .setStatus(500)
          .setMessage(error.message)
          .build()
      );
  }
};

/**
 * Handles Google authentication.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The response with the access token, refresh token, and user information.
 */
export const doGoogleAuth = async (req: Request, res: Response) => {
  const { code, state } = req.body;

  if (!code) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .ERROR(ResponseEnum.TokenNotExistError)
          .build()
      );
  }
  if (state !== (req.session as SessionAntiCSRF).state) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>().ERROR(ResponseEnum.TokenInvalidError).build()
      );
  }
  const oAuth2Client = await getAuthenticatedClient();

  const r = await oAuth2Client.getToken(code as string);
  oAuth2Client.setCredentials(r.tokens);

  const apiUrl =
    'https://people.googleapis.com/v1/people/me?personFields=names';
  const apiRes: any = await oAuth2Client.request({ url: apiUrl });

  if (apiRes.status !== 200) {
    return res
      .status(apiRes.status)
      .json(
        ResponseTypeBuilder<any>().ERROR(ResponseEnum.GoogleApiError).build()
      );
  }

  const tokenInfo = await oAuth2Client.getTokenInfo(
    oAuth2Client.credentials?.access_token || ''
  );

  const givenName = apiRes.data.names[0].givenName;
  const familyName = apiRes.data.names[0].familyName;
  const email = tokenInfo.email;
  if (!email) {
    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .ERROR(ResponseEnum.EmailNotFoundError)
          .build()
      );
  }

  const userExists = await findUserByEmail(email!);

  if (!userExists) {
    await createUser(
      User.build({
        email: email,
        password: crypto.randomBytes(20).toString('hex'),
        firstName: givenName,
        lastName: familyName,
        isGoogleRegistered: true,
        isEmailVerified: true,
        permission: [],
        username: '',
        lastSession: new Date(),
        loginCount: 1,
      })
    );
  }
  const { token, user } = await loginUser(email, '');
  return res
    .status(200)
    .json(
      ResponseTypeBuilder<any>()
        .SUCCESS(ResponseEnum.OperationSuccess)
        .setData({ accessToken: token, refreshToken: token, user: user })
        .build()
    );
};

/**
 * Resends the verification email to the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to void.
 */
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder<any>()
            .ERROR(ResponseEnum.EmailNotFoundError)
            .build()
        );
    }

    const user = await findUserByEmail(email);
    if (!user || user.isEmailVerified) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder<any>()
            .ERROR(ResponseEnum.EmailAlreadyVerifiedError)
            .setData({ isEmailVerified: user?.isEmailVerified })
            .build()
        );
    }

    await sendVerificationEmail(email);

    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .SUCCESS(ResponseEnum.EmailResendSuccess)
          .build()
      );
  } catch (error: any) {
    res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .setStatus(500)
          .setMessage(error.message)
          .build()
      );
  }
};

/**
 * Verifies the email address of the user.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A Promise that resolves to void.
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder<any>()
            .ERROR(ResponseEnum.TokenNotExistError)
            .build()
        );
    }

    const { e, v } = await verifyEmailToken(token);
    if (!v) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder<any>()
            .ERROR(ResponseEnum.TokenExpiredError)
            .build()
        );
    }
    const user = await findUserByEmail(e);
    if (user && !user.isEmailVerified) {
      await updateUserEmailVerification(user);
    }

    return res
      .status(200)
      .json(
        ResponseTypeBuilder<any>().SUCCESS(ResponseEnum.EmailVerified).build()
      );
  } catch (error: any) {
    res
      .status(200)
      .json(
        ResponseTypeBuilder<any>()
          .setStatus(500)
          .setMessage(error.message)
          .build()
      );
  }
};
