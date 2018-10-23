import { signupCtrl, signinCtrl } from '../../controllers/user';

const signup = async (req, res, next) => {
  try {
    const data = await signupCtrl(req.body);
    res.status(200).json({
      message: 'New user has been created',
      data: data
    });
  } catch(err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const data = await signinCtrl(req.body)
    res.status(200).json({
      message: 'Welcome to the JWT Auth',
      data: data
    });
  } catch (err) {
    next(err);
  }
};

export const signupMid = signup;
export const signinMid = signin;
