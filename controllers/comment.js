import Comment from '../models/commentModel.js';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';

//Posta ait comments  alma
export const getPostComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ postId: id });
    if (comments) {
      return res.status(200).json(comments);
    } else {
      return res.status(404).send(`No comments with id: ${id}`);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


//Comment oluşturma
export const createComment = async (req, res) => {
  const { msg } = req.body;
  const { id } = req.params;
  const creator = req.user;

  const newComment = new Comment({
    postId: id,
    creator: { _id: creator.id, username: creator.username },
    msg: msg,
  });
  const post = await Post.findById(id);
  post.comments = post.comments + 1;
  await post.save();
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//Comment Silme
export const deleteComment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const comment = await Comment.findById(id);
  const post = await Post.findById(comment.postId);
  post.comments = post.comments - 1;
  await post.save();
  await comment.remove();
  res.json({ message: 'Comment deleted successfully' });
};

//Kullanıcıya ait comments alma
export const getUserComments = async (req, res) => {
  const id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }
  const comments = await Comment.find({ 'creator._id': id });

  if (!comments) {
    return res.status(200).send(`No post for this user: ${id}`);
  }
  res.status(201).json(comments);
};

//Beğenme
export const likeComment = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const comment = await Comment.findById(id);

  comment.likes.push(userid);
  await comment.save();
  res.status(200).json({ msg: 'Succesfully liked' });
};

export const disLike = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  let comment = await Comment.findById(id);
  comment.likes = comment.likes.filter(like => like != userid);
  await comment.save();
  res.status(200).json({ msg: 'Succesfully deleted' });
};
