import jwt from 'jsonwebtoken';

export const generateToken = (_id) => {
  const payload = { _id };
  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: '3d' };

  return jwt.sign(payload, secretKey, options);
};
