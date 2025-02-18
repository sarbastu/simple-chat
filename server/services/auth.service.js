import { compare } from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

class AuthService {
  signup = async (email, password) => {
    email = email.trim();
    password = password.trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw { status: 409, message: 'Email already in use' };
    }

    const user = await User.create({ email, password });

    const token = generateToken(user._id);
    const sanitizedUser = await User.findById(user._id).select(
      'displayName email profileImage online'
    );

    return { data: sanitizedUser, token };
  };

  login = async (email, password) => {
    email = email.trim();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw { status: 400, message: 'Incorrect password' };
    }

    const token = generateToken(user._id);
    const sanitizedUser = await User.findById(user._id).select(
      'displayName password email profileImage online'
    );

    return { data: sanitizedUser, token };
  };
}

export default new AuthService();
