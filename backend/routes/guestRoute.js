import { createGuestUser } from "../controllers/guestControllers.js";
import { checkGuestAuth } from "../controllers/guestControllers.js";
import { guestProtectRoute } from "../middleware/auth.js";      
import express from "express";


const guestRouter = express.Router();

guestRouter.post("/guest", createGuestUser);
guestRouter.get("/guestauth", guestProtectRoute, checkGuestAuth);

export default guestRouter;