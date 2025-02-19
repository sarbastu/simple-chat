import User from '../models/user.model.js';

export const updateLastActive = async (req, res, next) => {
  const authId = req.user?._id;

  if (authId) {
    User.findByIdAndUpdate(authId, {
      lastActive: Date.now(),
    }).catch((error) => {
      console.error(`Error updating lastActive for user ${authId}:`, error);
    });
  }

  next();
};
