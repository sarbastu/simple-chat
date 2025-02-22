import { GROUP_ROUTE } from '../config/apiPaths.js';
import Contact from '../models/contact.model.js';
import Group from '../models/group.model.js';
import AppError from '../utils/appError.js';

class GroupServices {
  getGroups = async (authId, page = 1, limit = 20) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);
    const validatedPage = Math.max(Number(page) || 1, 1);

    const query = {
      members: { $in: [authId] },
    };

    const groups = await Group.find(query)
      .skip((validatedPage - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    const totalItems = Group.countDocuments(query);
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

    const baseUrl = `${GROUP_ROUTE}?limit=${maxLimit}`;

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

    return { groups: groups, pagination };
  };

  createGroup = async (authId, name = '') => {
    const group = await Group.create({
      name,
      admin: authId,
      members: [authId],
    });

    return { ...group.toObject() };
  };

  addMemberToGroup = async (authId, groupId, targetUserId) => {
    const uniquePair = [authId, targetUserId].sort().join('_');

    const isContact = await Contact.findOne({ uniquePair });

    if (!isContact) {
      throw new AppError(403, 'Recipient must be a contact');
    }

    const group = await Group.findOneAndUpdate(
      {
        _id: groupId,
        admin: authId,
      },
      {
        $addToSet: { members: targetUserId },
      },
      { new: true }
    );

    if (!group) {
      throw new AppError(403, 'Not authorized or group does not exist');
    }

    return { ...group.toObject() };
  };

  removeMemberFromGroup = async (authId, groupId, targetUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    if (group.admin.toString() !== authId) {
      throw new AppError(403, 'Not authorized to remove members');
    }

    if (group.admin.toString() === targetUserId) {
      throw new AppError(400, 'Admin can not be removed from the group');
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== targetUserId
    );

    await group.save();

    return { ...group.toObject() };
  };

  leaveGroup = async (authId, groupId) => {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    if (group.admin.toString() === authId) {
      await group.deleteOne();
      return { message: 'Group deleted' };
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== authId
    );

    if (group.members.length === 0) {
      await group.deleteOne();
      return { message: 'Group deleted' };
    }

    await group.save();

    return { ...group.toObject() };
  };
}

export default new GroupServices();
