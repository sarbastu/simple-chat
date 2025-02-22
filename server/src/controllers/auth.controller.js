import authService from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { clearCookie, setCookie } from '../utils/cookie.js';

export const signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Email and password are required to signup'));
  }

  try {
    const result = await authService.signup(email, password);
    setCookie(res, 'jwt', result.token);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, 'Email and password are required to signup'));
  }

  try {
    const result = await authService.login(email, password);
    setCookie(res, 'jwt', result.token);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = (_, res, next) => {
  try {
    clearCookie(res, 'jwt');
    return res.status(200);
  } catch (error) {
    next(error);
  }
};
