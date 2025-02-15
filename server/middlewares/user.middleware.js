import User from '../models/user.model.js';

export const updateLastActive = async (req, res, next) => {
  const userId = req.user?._id;

  if (userId) {
    User.findByIdAndUpdate(userId, {
      lastActive: Date.now(),
    }).catch((error) => {
      console.error(`Error updating lastActive for user ${userId}:`, error);
    });
  }

  next();
};
