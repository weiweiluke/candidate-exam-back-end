import { Request, Response, NextFunction } from 'express';
import { recordUserActivity } from '../services/userActivityService';

const activityLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (req.user) {
    try {
      await recordUserActivity(req.user.id, req.path);
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  next();
};

export default activityLogger;
