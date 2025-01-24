import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { compare } from 'bcrypt';

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

const sendUserData = (user) => {
  return {
    id: user.id,
    email: user.email,
    userName: user.userName,
    image: user.image,
    color: user.color,
    profile: user.profileSetup,
  };
};

export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: 'Email already in use' });
    }

    const user = await User.create({ email, password });

    response.cookie('jwt', createToken(user.id), {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return response.status(201).json({ user: sendUserData(user) });
  } catch (error) {
    console.error('Signup error:', error.stack);
    return response.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: 'Email not found' });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).json({ error: 'Incorrect password' });
    }

    response.cookie('jwt', createToken(user.id), {
      maxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return response.status(200).json({ user: sendUserData(user) });
  } catch (error) {
    console.error('Login error:', error.stack);
    return response.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserInfo = async (request, response) => {
  try {
    const user = await User.findById(request.userId); // Ensure that userId comes from a verified token

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    return response.status(200).json({ user: sendUserData(user) });
  } catch (error) {
    console.error('Get user info error:', error.stack);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
