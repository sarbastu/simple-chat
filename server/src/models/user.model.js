import { genSalt, hash } from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: false,
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileImage: {
      type: String,
      default:
        'https://res.cloudinary.com/djryb7nik/image/upload/v1739270578/profile_images/default.png',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    online: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.displayName) {
    this.displayName = `User-${this._id.toString()}`;
  }

  if (this.isModified('password')) {
    try {
      const salt = await genSalt(10);
      this.password = await hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
