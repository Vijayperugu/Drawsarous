import jwt from 'jsonwebtoken'
import userModal from '../model/UserModal.js';


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