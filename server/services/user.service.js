import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

class UserService {
  getProfile = async (authId) => {
    const userData = await User.findById(authId).select(
      'displayName email profileImage lastActive online'
    );

    if (!userData) {
      throw { status: 404, message: 'User not found' };
    }

    return userData;
  };

  updateProfile = async (authId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(authId, updateData, {
      new: true,
      runValidators: true,
    }).select('displayName email profileImage lastActive online');

    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }

    return updatedUser;
  };

  updateProfileImage = async (authId, image) => {
    const uploadResponse = await cloudinary.uploader
      .upload(image, {
        folder: 'profile_images',
        resource_type: 'image',
      })
      .catch((error) => {
        throw {
          status: 500,
          message: 'Image upload failed',
          error: error.message,
        };
      });

    const updatedUser = await User.findByIdAndUpdate(
      authId,
      {
        profileImage: uploadResponse.secure_url,
      },
      { new: true }
    ).select('displayName email profileImage lastActive online');

    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }

    return updatedUser;
  };

  getUsers = async (search = '', page = 1, limit = 20) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);

    const query = search
      ? {
          $or: [
            { displayName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('displayName email profileImage lastActive online')
      .sort({ displayName: -1, email: -1 })
      .skip((page - 1) * maxLimit)
      .limit(Number(maxLimit) || 20);

    const totalCount = await User.countDocuments(query);

    return { users, totalCount };
  };
}

export default new UserService();
