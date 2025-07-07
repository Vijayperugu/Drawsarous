import express from 'express'
import { checkAuth, loginUser,registerUser } from '../controllers/userControllers.js'
import { protectRoute } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/check',protectRoute,checkAuth)

export default userRouter;