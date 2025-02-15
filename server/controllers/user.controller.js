import userService from '../services/user.service.js';

export const getProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await userService.getProfile(userId);
    res.status(200).json({ message: 'Retrieved profile information', user });
  } catch (error) {
    console.error(`Error getting profile ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { displayName, color } = req.body;

  if (!displayName || !color) {
    return res
      .status(400)
      .json({ message: 'Display name and color are required' });
  }

  try {
    const user = await userService.updateProfile(userId, {
      displayName,
      color,
    });
    return res.status(200).json({ message: 'Updated profile', user });
  } catch (error) {
    console.error(`Error updating profile data: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  const userId = req.user._id;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const user = await userService.updateProfileImage(userId, image);
    return res.status(200).json({ message: 'Updated profile image', user });
  } catch (error) {
    console.error(`Error updating profile image: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const getUsers = async (req, res, next) => {
  const { search, page, limit } = req.query;

  try {
    const users = await userService.getUsers(search, page, limit);
    res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    next(error);
  }
};
