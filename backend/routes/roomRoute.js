import express from 'express';
import { createRoom,joinRoom,roomActive,addDrawing,getDrawingHistory,clearDrawingHistory,deleteRoom,addMessages,getMessages } from '../controllers/roomControllers.js';
import { protectRoute } from '../middleware/auth.js';

const roomRoute = express.Router();

roomRoute.post('/createRoom',protectRoute,createRoom);
roomRoute.post('/joinRoom',protectRoute,joinRoom)
roomRoute.get('/roomActive/:roomCode',roomActive)
roomRoute.post('/addDrawing', protectRoute, addDrawing);
roomRoute.get('/getDrawingHistory/:roomCode', protectRoute, getDrawingHistory);
roomRoute.post('/clearDrawingHistory', protectRoute, clearDrawingHistory);
roomRoute.post('/deleteRoom/:roomCode', protectRoute, deleteRoom);
roomRoute.post('/addMessages', protectRoute, addMessages);
roomRoute.get('/getMessageHistory/:roomCode', protectRoute, getMessages);


export default roomRoute;