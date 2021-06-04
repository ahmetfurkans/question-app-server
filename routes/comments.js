import express from 'express';
import {
  getPostComments,
  createComment,
  deleteComment,
  getUserComments,
  likeComment,
  disLike,
} from '../controllers/comment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/post/:id', getPostComments);
router.post('/:id', auth, createComment);
router.delete('/:id', deleteComment);
router.get('/user/comments', auth, getUserComments);
router.get('/:id', auth, likeComment);
router.get('/:id/delete', auth, disLike);

export default router;
