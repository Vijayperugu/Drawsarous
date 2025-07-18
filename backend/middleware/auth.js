import jwt from 'jsonwebtoken'
import userModal from '../model/UserModal.js';
import guestModal from '../model/guestModal.js';


export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.headers.token;
        if (!token) {
  return res.status(401).json({ success: false, message: "Token Missing" });
}
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModal.findById(decoded.id).select("-password");
        if(!user){
            res.json({
                success:false,
                message:"User Not found"
            })
            return;
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

export const guestProtectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const guestUser = await guestModal.findById(decoded.id);
    if (!guestUser) {
      return res.status(404).json({ success: false, message: "Guest User Not Found" });
    }
    req.guestUser = guestUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
}