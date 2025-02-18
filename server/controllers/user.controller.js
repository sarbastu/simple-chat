import userService from '../services/user.service.js';

export const getProfile = async (req, res) => {
  const authId = req.user._id;

  try {
    const result = await userService.getProfile(authId);
    const message = 'Profile retrieved';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error getting profile ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const authId = req.user._id;
  const { displayName, color } = req.body;

  if (!displayName || !color) {
    return res
      .status(400)
      .json({ message: 'Display name or color is missing' });
  }

  try {
    const result = await userService.updateProfile(authId, {
      displayName,
      color,
    });
    const message = 'Profile information updated';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error updating profile data: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  const authId = req.user._id;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image is missing' });
  }

  try {
    const result = await userService.updateProfileImage(authId, image);
    const message = 'Profile image updated';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error updating profile image: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  const { search, page, limit } = req.query;

  try {
    const result = await userService.getUsers(search, page, limit);
    const message = 'Users retrieved';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error retrieving users: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};
