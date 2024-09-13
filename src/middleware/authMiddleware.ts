import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import User from '../models/User';
import { findUserByEmail } from '../services/userService';
import { ResponseEnum, ResponseTypeBuilder } from '../utils/responseFormatter';

// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: User;
//   }
// }
// declare namespace Express {
//   export interface Request {
//     user?: User;
//   }
// }
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

/**
 * Middleware function for authentication.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const publicPaths = [
    '/users/logout',
    '/users/signup',
    '/users/signin',
    '/auth/google-auth',
    '/auth/get-google-auth-url',
    '/auth/verify-email',
  ];
  const needEmailVerificationPaths = [
    '/dashboard/users',
    '/dashboard/statistics',
  ];
  if (req.path.startsWith('/api-doc') || publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await findUserByEmail((decoded as User).email);
    if (!user) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder().ERROR(ResponseEnum.UserNotFoundError).build()
        );
    }
    //check if email not verified
    if (
      !user.isEmailVerified &&
      needEmailVerificationPaths.includes(req.path)
    ) {
      return res
        .status(200)
        .json(
          ResponseTypeBuilder()
            .ERROR(ResponseEnum.EmailNotVerifiedError)
            .build()
        );
    }
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
};

export default authMiddleware;
