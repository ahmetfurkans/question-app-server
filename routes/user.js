import express from 'express';
import { createUser, login, getUser } from '../controllers/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/', auth, getUser);

export default router;
