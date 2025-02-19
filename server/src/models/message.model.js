import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
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

messageSchema.pre(/^find/, function (next) {
  if (!this.getFilter().includeDeleted) {
    this.where({ deletedAt: null });
  }

  next();
});

messageSchema.pre('validate', function (next) {
  if (!this.receiver && !this.group) {
    return next(new Error('Message must have either a receiver or a group'));
  }
  if (this.receiver && this.group) {
    return next(new Error('Message cannot have both a receiver and a group'));
  }
  if (!this.text && !this.image) {
    return next(new Error('Message must contain either text or an image'));
  }
  if (this.receiver && this.sender.equals(this.receiver)) {
    return next(new Error('Sender and receiver cannot be the same user'));
  }
  next();
});

messageSchema.pre('save', function (next) {
  if (this.receiver && this.sender.equals(this.receiver)) {
    return next(new Error('Sender and receiver cannot be the same user'));
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
