import { promisify } from 'util';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { serverSettings } from '../../config';

const bcryptCompare = promisify(bcrypt.compare);
const bcryptHash = promisify(bcrypt.hash);

import User from '../models/user';
import { loginTimeoutError, validationError, badRequestError, authError } from '../utils/error';

export const registerCtrl = async ({ email, password }) => {
  try {
    const data = await User.findOne({ email }).lean();
    data && badRequestError('User already exists');

    const bCryptedPassword = await bcryptHash(password, 10);
    
    const user = new User({
      email: email,
      password: bCryptedPassword
    });

    return await user.save();
  } catch(err) {
    console.log(err);
    throw err;
  }
}

export const loginCtrl = async ({ email, password }) => {
  !email && validationError('Email is required');
  !password && validationError('Password is required');

  const user = await User.findOne({ email }).lean().exec();
  !user && authError('User not found');

  const result = await bcryptCompare(password, user.password);
  if (!result) {
    throw new Error('error bcrypt comparing password');
  }
  return await jwt.sign(
    { email: email },
    serverSettings.session.secret,
    {
      expiresIn: '1h'
    }
  );
}

// TODO: implement a secure way to logout with jwt (maybe destroy user's cookie)
export const logoutCtrl = async session => await session.destroy();

export const currentCtrl = async session => {
  (!session || !session.userId)  && loginTimeoutError('Session expired');
  console.log('---------------SESSION', session);

  // TODO: implement logic to take current user data
  return session.userId;
};
