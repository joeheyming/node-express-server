import { promisify } from 'util';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const bcryptCompare = promisify(bcrypt.compare);
const bcryptHash = promisify(bcrypt.hash);

import User from '../../models/user';

export const signupCtrl = async ({ email, password }) => {
  const hash = await bcryptHash(password, 10)
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: email,
    password: hash
  });

  await user.save();
  return { user };
}

export const signinCtrl = async ({ email, password }) => {
  const user = await (User.findOne({ email }).exec());
  const result = await bcryptCompare(password, user.password);
  
  if (result) {
    const JWTToken = jwt.sign(
      {
        email: user.email,
        _id: user._id
      },
      'secret',
      {
        expiresIn: '2h'
      }
    );

    return { user, token: JWTToken };
  }
  
  throw new Error('test custom error');
}
