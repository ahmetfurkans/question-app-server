import Post from '../models/postModel.js';
import mongoose from 'mongoose';

//All Posts
export const getPosts = async (req, res) => {
  const { page } = req.params;
  const limit = 5;
  const searchProperty = req.query.search;
  if (searchProperty) {
    try {
      const regex = new RegExp(searchProperty, 'gi');
      const postsLength = await Post.countDocuments({
        $or: [{ title: regex }, { content: regex }],
      });
      const posts = await Post.find({
        $or: [{ title: regex }, { content: regex }],
      })
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip(page * limit);
      const pages = Math.ceil(postsLength / limit);
      res.status(200).json({ posts: posts, pages: pages });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    try {
      const postsLength = await Post.countDocuments({});
      const pages = Math.ceil(postsLength / limit);
      const posts = await Post.find()
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip(page * limit);
      res.status(200).json({ pages: pages, posts: posts });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

//Single Post
export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Create Post Ctrl
export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const creator = req.user;

  const newPost = new Post({
    creator: {
      _id: creator.id,
      username: creator.username,
    },
    title,
    content,
    tags,
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//Remove Post Ctrl
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Post.findByIdAndDelete(id);
  res.json({ message: 'Post deleted successfully' });
};

//Update Post Ctrl
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { title, content, tags };
  await Post.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

//User Posts
export const getUserPosts = async (req, res) => {
  const id = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No user with id: ${id}`);
  }
  const { page } = req.params;
  const limit = 5;
  const searchProperty = req.query.search;
  if (searchProperty) {
    const regex = new RegExp(searchProperty, 'gi');
    const postsLength = await Post.find({ 'creator._id': id })
      .find({
        $or: [{ title: regex }, { content: regex }],
      })
      .countDocuments();
    const posts = await Post.find({ 'creator._id': id })
      .find({
        $or: [{ title: regex }, { content: regex }],
      })
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip(page * limit);
    const pages = Math.ceil(postsLength / limit);
    res.status(200).json({ posts: posts, pages: pages });
  } else {
    try {
      const postsLength = await Post.countDocuments({ 'creator._id': id });
      const pages = Math.ceil(postsLength / limit);
      const posts = await Post.find({ 'creator._id': id })
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip(page * limit);
      res.status(200).json({ pages: pages, posts: posts });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};
