import {
  createCtrl,
  getAllCtrl,
  getIdCtrl,
  patchCtrl,
  deleteCtrl
} from '../controllers/article';

export const createMid = async (req, res, next) => {
  try {
    const data = await createCtrl(req.body);
    res.status(200).json({
      message: 'New article has been created',
      data: data
    });
  } catch(error) {
    next(error);
  }
};

export const getAllMid = async (req, res, next) => {
  try {
    const data = await getAllCtrl();
    res.status(200).json({ data });
  } catch(error) {
    next(error);
  }
};

export const getIdMid = async (req, res, next) => {
  try {
    const data = getIdCtrl(req.params.id);
    res.status(200).json({ data });
  } catch(error) {
    next(error);
  }
};

export const patchMid = async (req, res, next) => {
  try {
    const data = await patchCtrl(req.params.id, req.body);
    res.status(200).json({ data });
  } catch(error) {
    next(error);
  }
};

export const deleteMid = async (req, res, next) => {
  try {
    const data = await deleteCtrl(req.params.id);
    res.status(200).json({ data });
  } catch(error) {
    next(error);
  }
};
