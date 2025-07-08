import express from 'express';
import { createRoom,joinRoom } from '../controllers/roomControllers.js';
import { protectRoute } from '../middleware/auth.js';

const roomRoute = express.Router();

roomRoute.post('/createRoom',protectRoute,createRoom);
roomRoute.post('/joinRoom',protectRoute,joinRoom)

export default roomRoute