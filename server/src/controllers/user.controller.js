import userService from '../services/user.service.js';
import AppError from '../utils/appError.js';

export const getProfile = async (req, res, next) => {
  const authId = req.user._id;

  try {
    const result = await userService.getProfile(authId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const authId = req.user._id;
  const { displayName, color } = req.body;

  if (!displayName || !color) {
    return res
      .status(400)
      .json({ message: 'Display name or color is required' });
  }

  try {
    const result = await userService.updateProfile(authId, {
      displayName,
      color,
    });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res, next) => {
  const authId = req.user._id;
  const { image } = req.body;

  if (!image) {
    return next(new AppError(400, 'Image is required'));
  }

  try {
    const result = await userService.updateProfileImage(authId, image);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  const { search, page, limit } = req.query;

  try {
    const result = await userService.getUsers(search, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
