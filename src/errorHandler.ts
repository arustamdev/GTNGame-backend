import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'No stack for you :D' : error.stack,
  });
}
