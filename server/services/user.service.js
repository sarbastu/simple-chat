import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

class UserService {
  getProfile = async ({ _id }) => {
    const userData = await User.findById(_id);
    if (!userData) {
      throw { status: 404, message: 'User not found' };
    }
    return userData;
  };

  updateProfile = async ({ _id }, { displayName, color }) => {
    if (!displayName || !color) {
      throw { status: 400, message: 'Incomplete fields' };
    }
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { displayName, color },
      { new: true, runValidators: true, select: '-password' }
    );
    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }
    return updatedUser;
  };

  updateProfileImage = async ({ _id }, { image }) => {
    if (!image) {
      throw { status: 400, message: 'Incomplete fields' };
    }
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'profile_images',
      resource_type: 'image',
    });
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        image: uploadResponse.secure_url,
      },
      { new: true, select: '-password' }
    );
    return updatedUser;
  };
}

export default new UserService();
