import { authVerifyCtrl } from '../controllers/auth';

export const authVerifyMid = async (req, res, next) => {
  try {
    const decoded = await authVerifyCtrl(req.headers);
    req.decoded = decoded;
    next();
  } catch(error) {
    next(error);
  }
};
