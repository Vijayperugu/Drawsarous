import userModal from "../model/UserModal.js";
import { customAlphabet } from "nanoid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
const nanoid = customAlphabet("1234567890", 4);

const createToken =(id) =>{
    return jwt.sign({id},process.env.JWT_SECRET);   
}

dotenv.config();

const createGuestUser = async (req, res) => {
  try {
    const userName = "Guest_" + nanoid();
    const email = userName + "@guest.com";
    const password = nanoid(8);
     const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    const newGuest = new userModal({
      name: userName,
      email: email,
      password: hashedPassword,
    });

    const guest =  await newGuest.save();
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

export { createGuestUser};
