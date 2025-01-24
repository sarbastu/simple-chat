import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { compare } from 'bcrypt';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (userID) => {
  return jwt.sign({ userID }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).send('Email already in use');
    }

    const user = await User.create({ email, password });

    response.cookie('jwt', createToken(user.id), {
      maxAge,
      secure: true,
      sameSite: 'None',
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        image: user.image,
        color: user.color,
        profile: user.profileSetup,
      },
    });
  } catch (error) {
    console.error('Signup error: ', error.message);
    return response.status(500).send('Server error');
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password, id } = request.body;
    if (!email | !password) {
      return response.status(400).send;
    }

    const user = await User.findOne({ email });
    if (!user) return response.status(404).send('Email not found');

    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(400).send('Incorrect password');
    }

    response.cookie('jwt', createToken(user.id), {
      maxAge,
      secure: true,
      sameSite: 'None',
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        image: user.image,
        color: user.color,
        profile: user.profileSetup,
      },
    });
  } catch (error) {
    console.error('Signup error: ', error.message);
    return response.status(500).send('Server error');
  }
};
