import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uniquePair: {
      type: String,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret._v;
        return ret;
      },
    },
  }
);

contactSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  this.status = 'rejected';
  return this.save();
};

contactSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.where({ deletedAt: null });
  }
  next();
});

contactSchema.pre('save', function (next) {
  if (this.requester.equals(this.recipient)) {
    return next(new Error('Requester and recipient cannot be the same user'));
  }

  this.uniquePair = [this.requester.toString(), this.recipient.toString()]
    .sort()
    .join('_');

  next();
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
