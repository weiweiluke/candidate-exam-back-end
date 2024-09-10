// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (!err.isOperational) {
    // 非操作性错误（编程或未知错误）
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  } else {
    // 操作性错误（客户端错误）
    res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }
};

export default errorHandler;
