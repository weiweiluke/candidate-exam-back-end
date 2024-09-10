import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { ResponseEnum, ResponseTypeBuilder } from '../utils/responseFormatter';

// frontend address
const allowedOrigins = config.corsUrl;

const allowedHeaders = ['Content-Type', 'Authorization'];

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        const error = new Error(ResponseEnum.CorsError.msg);
        res
          .status(200)
          .json(
            ResponseTypeBuilder<any>().ERROR(ResponseEnum.CorsError).build()
          );
        callback(error, false);
      }
    },
    allowedHeaders: allowedHeaders,
    optionsSuccessStatus: 200,
  };

  cors(corsOptions)(req, res, next);
};

export default corsMiddleware;
