import mongoose from 'mongoose';

import Article from '../models/article';
import { notFoundError, validationError } from '../utils/error';

function checkArg(arg, argName) {
  if(!arg) {
    validationError(`${argName} is required`);
  }
}

export const createCtrl = async ({ title, text, author }) => {
  checkArg(title, 'TITLE');
  checkArg(text, 'TEXT');
  checkArg(author, 'AUTHOR');

  const finalArticle = new Article({
    _id: new mongoose.Types.ObjectId(),
    title: title,
    text: text,
    author: author,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return await finalArticle.save();
};

export const getAllCtrl = async () => await Article.find().sort({ createdAt: 'descending' });

export const getIdCtrl = async id => {
  const article = await Article.findById(id).exec();
  !article && notFoundError('Article not found');
  return article;
}

export const patchCtrl = async (id, { title, text, author }) => {
  checkArg(title, 'TITLE');
  checkArg(text, 'TEXT');
  checkArg(author, 'AUTHOR');
  
  const data = await Article.findById(id).exec();
  !data && notFoundError('Article not found');

  data.title = title;
  data.text = text;
  data.updatedAt = new Date();
  return await data.save();
}

export const deleteCtrl = async id => {
  const article = await Article.findByIdAndDelete(id).exec();
  !article && notFoundError('Article not found');
  return { message: 'Article deleted successfully', article };
}
