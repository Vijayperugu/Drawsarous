import express from 'express';
import { createRoom,joinRoom,roomActive } from '../controllers/roomControllers.js';
import { protectRoute } from '../middleware/auth.js';

const roomRoute = express.Router();

roomRoute.post('/createRoom',protectRoute,createRoom);
roomRoute.post('/joinRoom',protectRoute,joinRoom)
roomRoute.get('/roomActive/:roomCode',roomActive)

export default roomRoute