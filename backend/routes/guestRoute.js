import { createGuestUser } from "../controllers/guestControllers.js";
import express from "express";


const guestRouter = express.Router();
guestRouter.post("/guest", createGuestUser);
export default guestRouter;