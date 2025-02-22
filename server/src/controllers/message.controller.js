import messageService from '../services/message.service.js';
import AppError from '../utils/appError.js';

export const sendMessage = async (req, res, next) => {
  const authId = req.user._id;
  const { targetUserId, groupId, text, image } = req.body;

  if (!targetUserId && !groupId) {
    return next(new AppError(400, 'Group or target user is required'));
  }
  if (!text && !image) {
    return next(new AppError(400, 'text or image is required'));
  }

  try {
    const result = await messageService.sendMessage(
      authId,
      targetUserId,
      groupId,
      text,
      image
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const authId = req.user._id;
  const { targetUserId, groupId, page, limit } = req.query;

  if (!targetUserId && !groupId) {
    return next(new AppError(400, 'Group or target user is required'));
  }

  try {
    const result = await messageService.getMessages(
      authId,
      targetUserId,
      groupId,
      page,
      limit
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
