import { compare } from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';
import AppError from '../utils/appError.js';

class AuthService {
  signup = async (email, password) => {
    email = email.trim();
    password = password.trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(409, 'Email already in use');
    }

    const user = await User.create({ email, password });

    const token = generateToken(user._id);
    const sanitizedUser = await User.findById(user._id).select(
      'displayName email profileImage online'
    );

    return { ...sanitizedUser.toObject(), token };
  };

  login = async (email, password) => {
    email = email.trim();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user || !(await compare(password, user.password))) {
      throw new AppError(400, 'Invalid credentials');
    }

    const token = generateToken(user._id);
    const sanitizedUser = await User.findById(user._id).select(
      'displayName password email profileImage online'
    );

    return { ...sanitizedUser.toObject(), token };
  };
}

export default new AuthService();
