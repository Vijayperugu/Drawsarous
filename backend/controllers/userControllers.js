import validator from 'validator'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import userModal from '../model/UserModal.js';

dotenv.config();

const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const loginUser = async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await userModal.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"User Not Found"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token =createToken(user._id);
            return res.json({
                success:true,
                message:"Login Successful",
                token
            })
        }else{
            res.json({
                success:false,
                message:"Incorrect Password"
            })
            
        }
        
    } catch (error) {
        console.log(error);
        
    }
}

const registerUser = async (req,res)=>{
    try {
        const {name ,email,password}= req.body;
    const exist = await userModal.findOne({email});
    if(exist){
        return res.json({
            success:false,
            message:"Mail Already Exist"
        })
    }
    if(!validator.isEmail(email)){
        return res.json({
            success:false,
            message:"Invalid Email"
        })
    }
    if(password.length<6){
        return res.json({
            success:false,
            message:"Enter Strong Password"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)



    const newUser = new userModal({
        name,email,password:hashedPassword

    })
    const user = await newUser.save();

    const token = createToken(user._id);

    return res.json({
        success:true,
        message:"Account Created Successfully",
        token
    })
        
    } catch (error) {
        console.error(error)
        
    }

}
export {loginUser,registerUser}