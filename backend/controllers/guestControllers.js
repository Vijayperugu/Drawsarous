import guestModal from "../model/guestModal.js";
import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 4);

const createToken =(id) =>{
    return jwt.sign({id},process.env.JWT_SECRET);   
}

dotenv.config();

const createGuestUser = async (req, res) => {
  try {
    const userName = "Guest" + nanoid();
    const email = userName + "@guest.com";

    const newGuest = new guestModal({
      name: userName,
      email: email,
    });

     const guest =await newGuest.save();

    const token = createToken(guest._id);

    res.json({
      success: true,
      message: "Guest User Created Successfully",
      userData: guest,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error Creating Guest User",
    });
  }
};
const checkGuestAuth = (req, res) => {
  res.json({
    success: true,
    message: "Guest User Authenticated",
    guestUser: req.guestUser,
  });
};

export { createGuestUser, checkGuestAuth };
