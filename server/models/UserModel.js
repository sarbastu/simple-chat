import { genSalt, hash } from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [7, 'Password must be at least 7 characters long'],
  },
  userName: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: '#000000',
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('Users', userSchema);

export default User;
