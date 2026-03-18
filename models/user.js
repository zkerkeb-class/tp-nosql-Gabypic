import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: {
    type: [Number],
    default: [],
  },
});

userSchema.pre('save', async function preSave() {
  if (!this.isModified('password')) return;
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
});

const User = mongoose.model('User', userSchema);

export default User;

