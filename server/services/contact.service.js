import Contact from '../models/contact.model.js';

class ContactService {
  requestContact = async (authId, targetUserId) => {
    const uniquePair = [authId, targetUserId].sort().join('_');

    const existing = await Contact.findOne({ uniquePair }).setOptions({
      includeDeleted: true,
    });

    if (!existing) {
      return await Contact.create({ requester: authId, targetUserId });
    }
    if (existing.status === 'accepted') {
      throw { status: 400, message: 'Contact already added' };
    }
    if (existing.status === 'pending' && existing.requester.equals(authId)) {
      throw { status: 400, message: 'Request already exists' };
    }
    if (existing.status === 'pending' && existing.recipient.equals(authId)) {
      existing.status = 'accepted';
    }
    if (existing.status === 'rejected' || existing.deletedAt) {
      Object.assign(existing, {
        requester: authId,
        recipient: targetUserId,
        status: 'pending',
        deletedAt: null,
      });
    }

    await existing.save();
    return existing;
  };

  acceptContact = async (authId, contactId) => {
    const contact = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        recipient: authId,
        status: 'pending',
      },
      { status: 'accepted' },
      { new: true }
    );

    if (!contact) {
      throw { status: 404, message: 'Contact request not found' };
    }

    return contact;
  };

  removeContact = async (authId, contactId, hardDelete = false) => {
    const contact = await Contact.findOne({
      _id: contactId,
      $or: [{ requester: authId }, { recipient: authId }],
    });

    if (!contact) {
      throw { status: 404, message: 'Contact not found' };
    }

    if (hardDelete) {
      await contact.deleteOne();
    } else {
      await contact.softDelete();
    }

    return contact;
  };

  getContacts = async (authId, search, page = 1, limit = 20) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);

    const baseQuery = {
      $or: [{ requester: authId }, { recipient: authId }],
      status: 'accepted',
    };

    if (search) {
      baseQuery.$and = [
        baseQuery,
        {
          $or: [
            { 'requester.email': { $regex: search, $options: 'i' } },
            { 'requester.displayName': { $regex: search, $options: 'i' } },
            { 'recipient.email': { $regex: search, $options: 'i' } },
            { 'recipient.displayName': { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const contacts = await Contact.find(baseQuery)
      .populate(
        'requester',
        '_id email displayName profileImage lastActive online'
      )
      .populate(
        'recipient',
        '_id email displayName profileImage lastActive online'
      )
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    return this.#getContactDetails(authId, contacts);
  };

  getRequests = async (authId, page = 1, limit = 20) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);

    const contacts = await Contact.find({
      recipient: authId,
      status: 'pending',
    })
      .populate({
        path: 'requester',
        select: '_id email displayName profileImage',
      })
      .skip((page - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    return this.#getContactDetails(authId, contacts);
  };

  #getContactDetails = (authId, contacts) => {
    return contacts
      .map((contact) => {
        if (contact.requester && !contact.requester._id.equals(authId)) {
          return { _id: contact._id, user: contact.requester };
        }
        if (contact.recipient && !contact.recipient._id.equals(authId)) {
          return { _id: contact._id, user: contact.recipient };
        }
      })
      .filter(Boolean);
  };
}

export default new ContactService();
