import contactService from '../services/contact.service.js';

export const getContacts = async (req, res) => {
  const userId = req.user._id;
  const { search, page, limit } = req.query;

  try {
    const contacts = await contactService.getContacts(
      userId,
      search,
      page,
      limit
    );
    return res.status(200).json({ message: 'Retrieved contacts', contacts });
  } catch (error) {
    console.error(`Error retieving contacts: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getContactRequests = async (req, res) => {
  const userId = req.user._id;

  try {
    const requests = await contactService.getRequests(userId);
    return res.status(200).json({
      message: 'Retrieved requests',
      requests,
      count: requests.length,
    });
  } catch (error) {
    console.error(`Error retrieving contact requests: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const requestContact = async (req, res) => {
  const userId = req.user._id;
  const { recipientId } = req.body;

  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient ID is required' });
  }

  try {
    await contactService.requestContact(userId, recipientId);
    return res.status(201).json({ message: 'Request sent' });
  } catch (error) {
    console.error(`Error sending contact request: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const acceptContact = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Contact id is required' });
  }

  try {
    await contactService.acceptContact(userId, contactId);
    return res.status(200).json({ message: 'Contact added' });
  } catch (error) {
    console.error(`Error adding contact: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const removeContact = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Contact id is required' });
  }

  try {
    await contactService.removeContact(userId, contactId);
    return res.status(200).json({ message: 'Contact removed' });
  } catch (error) {
    console.error(`Error removing contact: ${error.message}`);
    res.status(error.status || 500).json({ message: error.message });
  }
};
