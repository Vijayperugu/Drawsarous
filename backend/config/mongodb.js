import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async ()=>{
    mongoose.connection.on('connected',()=>{
        console.log("Database connection Established");
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/Drawsarous`)
}
export default connectDb