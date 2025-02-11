import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Internal server error.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return error.name === 'TokenExpiredError'
      ? res.status(401).json({ error: 'Token expired. Please log in again.' })
      : res.status(403).json({ error: 'Invalid token.' });
  }
};
