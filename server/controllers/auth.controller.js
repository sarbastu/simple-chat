import authService from '../services/auth.service.js';
import { clearCookie, setCookie } from '../utils/cookie.js';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'No email or password are selected to signup' });
  }

  try {
    const result = await authService.signup(email, password);
    setCookie(res, 'jwt', result.token);
    const message = 'Account created';
    return res.status(201).json({ message, ...result });
  } catch (error) {
    console.error(`Signup error: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'No email or password are selected to login' });
  }

  try {
    const result = await authService.login(email, password);
    setCookie(res, 'jwt', result.token);
    const message = 'Login successful';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const logout = (_, res) => {
  try {
    clearCookie(res, 'jwt');
    const message = 'Logout successful';
    return res.status(200).json({ message });
  } catch (error) {
    console.error(`Error logging out: ${error.message}`);
    return res
      .status(error.status || 500)
      .json({ message: 'Internal server error' });
  }
};
