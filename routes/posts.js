import express from 'express';
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
} from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:page', getPosts);
router.get('/post/:id', getPost);
router.post('/', auth, createPost);
router.delete('/:id', deletePost);
router.patch('/:id', updatePost);
router.get('/user/posts/:page', auth, getUserPosts);

export default router;
