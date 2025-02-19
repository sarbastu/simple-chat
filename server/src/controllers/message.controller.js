import messageService from '../services/message.service.js';

export const sendMessage = async (req, res) => {
  const authId = req.user._id;
  const { targetUserId, groupId, text, image } = req.body;

  if (!targetUserId && !groupId) {
    return res.status(400).json({ message: 'User or group is missing' });
  }
  if (!text && !image) {
    return res.status(400).json({ message: 'Text or image is required' });
  }

  try {
    const result = await messageService.sendMessage(
      authId,
      targetUserId,
      groupId,
      text,
      image
    );
    const message = 'Message sent';
    return res.status(201).json({ message, ...result });
  } catch (error) {
    console.error(`Error sending message: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  const authId = req.user._id;
  const { targetUserId, groupId, page, limit } = req.query;

  if (!targetUserId && !groupId) {
    return res.status(400).json({ message: 'User or group is missing' });
  }

  try {
    const result = await messageService.getMessages(
      authId,
      targetUserId,
      groupId,
      page,
      limit
    );
    const message = 'Messages retrieved';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error retrieving messages: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};
