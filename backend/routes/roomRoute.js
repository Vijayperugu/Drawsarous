import express from 'express';
import { createRoom,joinRoom,roomActive,addDrawing,getDrawingHistory,clearDrawingHistory } from '../controllers/roomControllers.js';
import { protectRoute } from '../middleware/auth.js';

const roomRoute = express.Router();

roomRoute.post('/createRoom',protectRoute,createRoom);
roomRoute.post('/joinRoom',protectRoute,joinRoom)
roomRoute.get('/roomActive/:roomCode',roomActive)
roomRoute.post('/addDrawing', protectRoute, addDrawing);
roomRoute.get('/getDrawingHistory/:roomCode', protectRoute, getDrawingHistory);
roomRoute.post('/clearDrawingHistory', protectRoute, clearDrawingHistory);

export default roomRoute;