import jwt from 'jsonwebtoken';

export const verifyToken = async (request, response, next) => {
  try {
    const token =
      request.cookies.jwt || request.headers.authorization?.split(' ')[1];

    if (!token) {
      return response.status(401).json({ error: 'No token provided.' });
    }

    if (!process.env.JWT_KEY) {
      return response
        .status(500)
        .json({ error: 'Internal server error. Missing JWT key.' });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    request.userId = payload.userId;

    next();
  } catch (error) {
    return error.name === 'TokenExpiredError'
      ? response
          .status(401)
          .json({ error: 'Token expired. Please log in again.' })
      : response.status(403).json({ error: 'Invalid token.' });
  }
};
