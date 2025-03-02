import { USER_ROUTE } from '../config/apiPaths.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

class UserService {
  getProfile = async (authId) => {
    const userData = await User.findById(authId).select(
      'displayName email profileImage online'
    );

    if (!userData) {
      throw new AppError(404, 'User not found');
    }

    return { ...userData.toObject() };
  };

  updateProfile = async (authId, imagePath, updateData) => {
    let updateFields = { ...updateData };

    if (imagePath) {
      const uploadResponse = await cloudinary.uploader
        .upload(imagePath, {
          folder: 'profile_images',
          resource_type: 'image',
        })
        .catch((error) => {
          throw new AppError(500, 'Image upload failed');
        });

      updateFields.profileImage = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(authId, updateFields, {
      new: true,
      runValidators: true,
    }).select('displayName email profileImage online');

    if (!updatedUser) {
      throw new AppError(404, 'User not found');
    }

    return { ...updatedUser };
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

    const baseUrl = `${USER_ROUTE}?search=${search || ''}&limit=${maxLimit}`;

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

    return { users: users, pagination };
  };
}

export default new UserService();
