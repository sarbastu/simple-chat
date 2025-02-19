import Contact from '../models/contact.model.js';

class ContactService {
  requestContact = async (authId, targetUserId) => {
    const uniquePair = [authId, targetUserId].sort().join('_');

    const existing = await Contact.findOne({ uniquePair }).setOptions({
      includeDeleted: true,
    });

    if (!existing) {
      return await Contact.create({
        requester: authId,
        recipient: targetUserId,
      });
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
      existing.requester = authId;
      existing.recipient = targetUserId;
      existing.status = 'pending';
      existing.deletedAt = null;
    }

    await existing.save();
    return { data: existing };
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

    return { data: contact };
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

  getContacts = async (authId, search, page = 1, limit) => {
    const maxLimit = Math.min(Number(limit) || 50, 100);
    const validatedPage = Math.max(Number(page) || 1, 1);

    const query = {
      $or: [{ requester: authId }, { recipient: authId }],
      status: 'accepted',
    };

    if (search) {
      query.$and = [
        query,
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

    const contacts = await Contact.find(query)
      .populate('requester', '_id email displayName profileImage online')
      .populate('recipient', '_id email displayName profileImage online')
      .skip((validatedPage - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    const contactsFormatted = this.#getContactDetails(authId, contacts);

    const totalItems = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalItems / maxLimit);

    const pagination = {
      totalItems,
      totalPages,
      currentPage: validatedPage,
      pageSize: maxLimit,
      hasPreviousPage: validatedPage > 1,
      previousPage: validatedPage > 1 ? validatedPage - 1 : null,
      hasNextPage: validatedPage < totalPages,
      nextPage: validatedPage < totalPages ? validatedPage + 1 : null,
    };

    const baseUrl = `/contact?search=${search || ''}&limit=${maxLimit}`;

    pagination.links = {
      self: `${baseUrl}&page=${validatedPage}`,
      ...(pagination.hasPreviousPage && {
        previous: `${baseUrl}&page=${pagination.previousPage}`,
      }),
      ...(pagination.hasNextPage && {
        next: `${baseUrl}&page=${pagination.nextPage}`,
      }),
      last: `${baseUrl}&page=${totalPages}`,
    };

    return { data: contactsFormatted, pagination };
  };

  getRequests = async (authId, page = 1, limit) => {
    const maxLimit = Math.min(Number(limit) || 20, 100);
    const validatedPage = Math.max(Number(page) || 1, 1);

    const query = { recipient: authId, status: 'pending' };

    const contacts = await Contact.find(query)
      .populate({
        path: 'requester',
        select: '_id email displayName profileImage',
      })
      .skip((validatedPage - 1) * maxLimit)
      .limit(maxLimit)
      .lean();

    const contactsFormatted = this.#getContactDetails(authId, contacts);

    const totalItems = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalItems / maxLimit);

    const pagination = {
      totalItems,
      totalPages,
      currentPage: validatedPage,
      pageSize: maxLimit,
      hasPreviousPage: validatedPage > 1,
      previousPage: validatedPage > 1 ? validatedPage - 1 : null,
      hasNextPage: validatedPage < totalPages,
      nextPage: validatedPage < totalPages ? validatedPage + 1 : null,
    };

    const baseUrl = `/contact/pending?limit=${maxLimit}`;

    pagination.links = {
      self: `${baseUrl}&page=${validatedPage}`,
      ...(pagination.hasPreviousPage && {
        previous: `${baseUrl}&page=${pagination.previousPage}`,
      }),
      ...(pagination.hasNextPage && {
        next: `${baseUrl}&page=${pagination.nextPage}`,
      }),
      last: `${baseUrl}&page=${totalPages}`,
    };

    return { data: contactsFormatted, pagination };
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
