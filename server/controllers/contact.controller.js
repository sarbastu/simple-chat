import contactService from '../services/contact.service.js';

export const getContacts = async (req, res) => {
  const authId = req.user._id;
  const { search, page, limit } = req.query;

  try {
    const result = await contactService.getContacts(
      authId,
      search,
      page,
      limit
    );
    const message = 'Retrieved contacts';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error retrieving contacts: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

export const getContactRequests = async (req, res) => {
  const authId = req.user._id;

  try {
    const result = await contactService.getRequests(authId);
    const message = 'Retrieved requests';
    return res.status(200).json({ message, ...result });
  } catch (error) {
    console.error(`Error retrieving contact requests: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
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
    const message = 'Request sent';
    return res.status(201).json({ message });
  } catch (error) {
    console.error(`Error sending contact request: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
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
    const message = 'Contact added';
    return res.status(200).json({ message });
  } catch (error) {
    console.error(`Error adding contact: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
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
    const message = 'Contact removed';
    return res.status(200).json({ message });
  } catch (error) {
    console.error(`Error removing contact: ${error.message}`);
    return res.status(error.status || 500).json({ message: error.message });
  }
};
