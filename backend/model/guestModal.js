import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
})
const guestModal = mongoose.model('guest',guestSchema);
export default guestModal;