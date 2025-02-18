import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';

class UserService {
  getProfile = async (authId) => {
    const userData = await User.findById(authId).select(
      'displayName email profileImage online'
    );

    if (!userData) {
      throw { status: 404, message: 'User not found' };
    }

    return { data: userData };
  };

  updateProfile = async (authId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(authId, updateData, {
      new: true,
      runValidators: true,
    }).select('displayName email profileImage online');

    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }

    return { data: updatedUser };
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
          message: `Image upload failed: ${error.message}`,
        };
      });

    const updatedUser = await User.findByIdAndUpdate(
      authId,
      {
        profileImage: uploadResponse.secure_url,
      },
      { new: true }
    ).select('displayName email profileImage online');

    if (!updatedUser) {
      throw { status: 404, message: 'User not found' };
    }

    return { data: updatedUser };
  };

  getUsers = async (search = '', page = 1, limit) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);
    const validatedPage = Math.max(Number(page) || 1, 1);

    const query = search
      ? {
          $or: [
            { displayName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select('displayName email profileImage online')
      .sort({ displayName: -1, email: -1 })
      .skip((validatedPage - 1) * maxLimit)
      .limit(Number(maxLimit) || 20);

    const totalItems = await User.countDocuments(query);
    const totalPages = Math.ceil(totalItems / maxLimit);

    const pagination = {
      totalItems,
      totalPages,
      currentPage: validatedPage,
      pageSize: maxLimit,
      hasPreviousPage: validatedPage > 1,
      previousPage: validatedPage > 1 ? validatedPage - 1 : null,
      hasNextPage: validatedPage < totalPages,
      nextPage: validatedPage < totalPages ? validatedPage + 1 : null,
    };

    const baseUrl = `/user?search=${search || ''}&limit=${maxLimit}`;

    pagination.links = {
      self: `${baseUrl}&page=${validatedPage}`,
      ...(pagination.hasPreviousPage && {
        previous: `${baseUrl}&page=${pagination.previousPage}`,
      }),
      ...(pagination.hasNextPage && {
        next: `${baseUrl}&page=${pagination.nextPage}`,
      }),
      last: `${baseUrl}&page=${totalPages}`,
    };

    return { data: users, pagination };
  };
}

export default new UserService();
