import { MESSAGE_ROUTE } from '../config/apiPaths.js';
import cloudinary from '../config/cloudinary.js';
import Contact from '../models/contact.model.js';
import Group from '../models/group.model.js';
import Message from '../models/message.model.js';
import AppError from '../utils/appError.js';

class MessageServices {
  sendMessage = async (authId, targetUserId, groupId, text, image) => {
    const isAuth = await this.#isAuth(authId, targetUserId, groupId);
    if (!isAuth) {
      throw new AppError(403, 'Not authorized to send this message');
    }

    let imageUrl = '';
    if (image) {
      const uploadResponse = await cloudinary.uploader
        .upload(image, {
          folder: 'message_images',
          resource_type: 'image',
        })
        .catch((error) => {
          console.error(error);
          throw new AppError(500, 'Image upload failed');
        });
      imageUrl = uploadResponse.secure_url;
    }

    const message = await Message.create({
      sender: authId,
      ...(targetUserId && { receiver: targetUserId }),
      ...(groupId && { group: groupId }),
      ...(text && { text }),
      ...(image && { image: imageUrl }),
    });

    return { ...message.toObject() };
  };

  getMessages = async (authId, targetUserId, groupId, page = 1, limit) => {
    const isAuth = await this.#isAuth(authId, targetUserId, groupId);
    if (!isAuth) {
      throw new AppError(403, 'Not authorized to send this message');
    }

    const maxLimit = Math.min(Number(limit) || 20, 100);
    const validatedPage = Math.max(Number(page) || 1, 1);

    const query = targetUserId
      ? {
          $or: [
            { sender: authId, receiver: targetUserId },
            { sender: targetUserId, receiver: authId },
          ],
        }
      : { group: groupId };

    const messages = await Message.find(query)
      .select('sender receiver group text image createdAt')
      .sort({ createdAt: -1 })
      .skip((validatedPage - 1) * maxLimit)
      .limit(maxLimit);

    const totalItems = await Message.countDocuments(query);
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

    const baseUrl = `${MESSAGE_ROUTE}?limit=${maxLimit}`;
    baseUrl += targetUserId
      ? `&targetUserId=${targetUserId}`
      : `&groupId=${groupId}`;

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

    return { messages: messages, pagination };
  };

  #isAuth = async (authId, targetUserId, groupId) => {
    if (targetUserId) {
      const isContact = await Contact.findOne({
        $or: [
          { requester: authId, recipient: targetUserId },
          { requester: targetUserId, recipient: authId },
        ],
        status: 'accepted',
      }).select('_id');
      if (isContact) {
        return true;
      }
    }

    if (groupId) {
      const isMember = await Group.findOne({
        _id: groupId,
        members: { $in: [authId] },
      }).select('_id');
      if (isMember) {
        return true;
      }
    }

    return false;
  };
}

export default new MessageServices();
