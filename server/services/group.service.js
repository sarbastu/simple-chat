import Contact from '../models/contact.model.js';
import Group from '../models/group.model.js';

class GroupServices {
  getGroups = async (authId, page = 1, limit = 20) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);
    const groups = await Group.find({
      members: authId,
    })
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    return groups;
  };

  createGroup = async (authId, name = '') => {
    const group = await Group.create({
      name,
      admin: authId,
      members: [authId],
    });

    return group;
  };

  addMemberToGroup = async (authId, groupId, targetUserId) => {
    const uniquePair = [authId, targetUserId].sort().join('_');

    const isContact = await Contact.findOne({ uniquePair });

    if (!isContact) {
      throw { status: 403, message: 'Recipient must be a contact' };
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
      throw { status: 403, message: 'Not authorized or group not found' };
    }

    return group;
  };

  removeMemberFromGroup = async (authId, groupId, targetUserId) => {
    const group = await Group.findById(groupId);

    if (!group) {
      throw { status: 404, message: 'Group not found' };
    }

    if (group.admin.toString() !== authId) {
      throw { status: 403, message: 'Not authorized to remove members' };
    }

    if (group.admin.toString() === targetUserId) {
      throw { status: 400, message: "Admin can't be removed from the group" };
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== targetUserId
    );

    await group.save();

    return group;
  };

  leaveGroup = async (authId, groupId) => {
    const group = await Group.findById(groupId);

    if (!group) {
      throw { status: 404, message: 'Group not found' };
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

    return group;
  };
}

export default new GroupServices();
