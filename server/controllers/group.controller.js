import groupService from '../services/group.service.js';

export const getGroups = async (req, res) => {
  const authId = req.user._id;
  const { page, limit } = req.query;

  try {
    const groups = await groupService.getGroups(authId, page, limit);
    return res.status(200).json({ message: 'Retrieved groups', groups });
  } catch (error) {
    console.error(`Error retrieving groups: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const createGroup = async (req, res) => {
  const authId = req.user._id;
  const { name } = req.body;

  try {
    const group = await groupService.createGroup(authId, name);
    return res.status(201).json({ message: 'Group created', group });
  } catch (error) {
    console.error(`Error creating group: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const addMemberToGroup = async (req, res) => {
  const authId = req.user._id;
  const { groupId, targetUserId } = req.params;

  if (!groupId || !targetUserId) {
    return res.status(400).json({ message: 'Group or user is missing' });
  }

  try {
    const group = await groupService.addMemberToGroup(
      authId,
      groupId,
      targetUserId
    );
    return res.status(200).json({ message: 'Added user to group', group });
  } catch (error) {
    console.error(`Error adding member to group: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  const authId = req.user._id;
  const { groupId, targetUserId } = req.params;

  if (!groupId || !targetUserId) {
    return res.status(400).json({ message: 'Group or user is missing' });
  }

  try {
    const group = await groupService.removeMemberFromGroup(
      authId,
      groupId,
      targetUserId
    );
    return res.status(200).json({ message: 'Removed user from group', group });
  } catch (error) {
    console.error(`Error removing member from group: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  const authId = req.user._id;
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ message: 'Group is missing' });
  }

  try {
    const group = await groupService.leaveGroup(authId, groupId);
    return res.status(200).json({ message: 'Left group', group });
  } catch (error) {
    console.error(`Error leaving group: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};
