import { compare } from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.js';

class AuthService {
  signup = async ({ email, password }) => {
    if (!email || !password) {
      throw { status: 400, message: 'Email and password required' };
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 409, message: 'Email already in use' };
    }
    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    user.password = undefined;
    return { user, token };
  };

  login = async ({ email, password }) => {
    if (!email || !password) {
      throw { status: 400, message: 'Email and password required' };
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    const confirmPassword = await compare(password, user.password);
    if (confirmPassword) {
      const token = generateToken(user._id);
      user.password = undefined;
      return { user, token };
    } else {
      throw { status: 400, message: 'Incorrect password' };
    }
  };
}

export default new AuthService();
