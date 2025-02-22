import AppError from '../utils/appError.js';

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({ message: error.message });
  }

  console.error(error);

  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
