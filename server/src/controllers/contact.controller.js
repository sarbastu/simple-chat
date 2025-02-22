import contactService from '../services/contact.service.js';
import AppError from '../utils/appError.js';

export const requestContact = async (req, res, next) => {
  const authId = req.user._id;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return next(new AppError(400, 'Target user is required'));
  }

  try {
    await contactService.requestContact(authId, targetUserId);
    return res.status(201);
  } catch (error) {
    next(error);
  }
};

export const acceptContact = async (req, res, next) => {
  const authId = req.user._id;
  const { contactId } = req.params;

  if (!contactId) {
    return next(new AppError(400, 'Contact is required'));
  }

  try {
    await contactService.acceptContact(authId, contactId);
    return res.status(200);
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  const authId = req.user._id;
  const { contactId, hardDelete } = req.params;

  if (!contactId) {
    return next(new AppError(400, 'Contact is required'));
  }

  try {
    await contactService.removeContact(authId, contactId, hardDelete);
    return res.status(200);
  } catch (error) {
    next(error);
  }
};

export const getContactRequests = async (req, res, next) => {
  const authId = req.user._id;

  try {
    const result = await contactService.getRequests(authId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  const authId = req.user._id;
  const { search, page, limit } = req.query;

  try {
    const result = await contactService.getContacts(
      authId,
      search,
      page,
      limit
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
