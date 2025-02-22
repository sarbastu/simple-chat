import groupService from '../services/group.service.js';
import AppError from '../utils/appError.js';

export const createGroup = async (req, res, next) => {
  const authId = req.user._id;
  const { name } = req.body;

  try {
    const result = await groupService.createGroup(authId, name);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const addMemberToGroup = async (req, res, next) => {
  const authId = req.user._id;
  const { groupId, targetUserId } = req.params;

  if (!groupId || !targetUserId) {
    return next(new AppError(400, 'Group or target user is required'));
  }

  try {
    const result = await groupService.addMemberToGroup(
      authId,
      groupId,
      targetUserId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeMemberFromGroup = async (req, res, next) => {
  const authId = req.user._id;
  const { groupId, targetUserId } = req.params;

  if (!groupId || !targetUserId) {
    return next(new AppError(400, 'Group or target user is required'));
  }

  try {
    const result = await groupService.removeMemberFromGroup(
      authId,
      groupId,
      targetUserId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  const authId = req.user._id;
  const { groupId } = req.params;

  if (!groupId) {
    return next(new AppError(400, 'Group or target user is required'));
  }

  try {
    const result = await groupService.leaveGroup(authId, groupId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req, res, next) => {
  const authId = req.user._id;
  const { page, limit } = req.query;

  try {
    const result = await groupService.getGroups(authId, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
