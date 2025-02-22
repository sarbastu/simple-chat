import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Token is required');
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError(500, 'Internal server error');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expired'));
    } else {
      return next(new AppError(403, 'Invalid token'));
    }
  }
};
