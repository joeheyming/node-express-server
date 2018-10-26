import {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  currentCtrl
} from '../controllers/user';

import { serverSettings } from '../../config';

export const registerMid = async (req, res, next) => {
  try {
    const data = registerCtrl(req.body);
    res.status(200).json({
      message: 'New user has been created',
      data: data
    });
  } catch(err) {
    next(err);
  }
};

export const loginMid = async (req, res, next) => {
  try {
    const data = await loginCtrl(req.body);
    req.session.userId = data.user._id;
    res.status(200).json({
      message: 'Welcome to the JWT Auth',
      data: data
    });
  } catch(err) {
    next(err);
  }
};

export const logoutMid = async (req, res, next) => {
  try {
    await logoutCtrl(req.session);
    res.clearCookie(serverSettings.cookie.name)
      .status(200)
      .json({
        message: 'Logout done'
      });
  } catch(err) {
    next(err);
  }
};

export const currentMid = async (req, res, next) => {
  try {
    const data = await currentCtrl(req.session);
    res.status(200).json({
      data
    });
  } catch(err) {
    next(err);
  }
};
