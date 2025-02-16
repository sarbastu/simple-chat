import contactService from '../services/contact.service.js';

export const getContacts = async (req, res) => {
  const authId = req.user._id;
  const { search, page, limit } = req.query;

  try {
    const contacts = await contactService.getContacts(
      authId,
      search,
      page,
      limit
    );
    return res.status(200).json({ message: 'Retrieved contacts', contacts });
  } catch (error) {
    console.error(`Error retrieving contacts: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getContactRequests = async (req, res) => {
  const authId = req.user._id;

  try {
    const requests = await contactService.getRequests(authId);
    return res.status(200).json({
      message: 'Retrieved requests',
      requests,
    });
  } catch (error) {
    console.error(`Error retrieving contact requests: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const requestContact = async (req, res) => {
  const authId = req.user._id;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ message: 'Target user is missing' });
  }

  try {
    await contactService.requestContact(authId, targetUserId);
    return res.status(201).json({ message: 'Request sent' });
  } catch (error) {
    console.error(`Error sending contact request: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const acceptContact = async (req, res) => {
  const authId = req.user._id;
  const { contactId } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Contact is missing' });
  }

  try {
    await contactService.acceptContact(authId, contactId);
    return res.status(200).json({ message: 'Contact added' });
  } catch (error) {
    console.error(`Error adding contact: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const removeContact = async (req, res) => {
  const authId = req.user._id;
  const { contactId, hardDelete } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Contact is missing' });
  }

  try {
    await contactService.removeContact(authId, contactId, hardDelete);
    return res.status(200).json({ message: 'Contact removed' });
  } catch (error) {
    console.error(`Error removing contact: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};
