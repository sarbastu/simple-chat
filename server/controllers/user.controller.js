import userService from '../services/user.service.js';

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user);
    res.status(200).json({ message: 'Retrieved profile information', user });
  } catch (error) {
    console.error(`Error getting profile ${error}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user, req.body);
    return res.status(200).json({ message: 'Updated profile', user });
  } catch (error) {
    console.error(`Error updating profile data: ${error}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const user = await userService.updateProfileImage(req.user, req.body);
    return res.status(200).json({ message: 'Updated profile image', user });
  } catch (error) {
    console.error(`Error updating profile image: ${error}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};
