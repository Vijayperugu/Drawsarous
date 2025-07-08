import mongoose from 'mongoose';
const RoomSchems = new mongoose.Schema({

    roomCode :{
        type:String,
        required:true,
        unique:true
    },
    host:{
        type:String,
        required:true
    },
    players:[{
        userName:String,
        socketId:String
    }],
    guessingWord:{
        type:String,
        default:"Apple"
    },
    drawingData:{
        type:Array,default:[]
    },
    isActive:{
        type:Boolean,
        default:true
    }


})
const RoomModal = mongoose.model('room',RoomSchems);

export default RoomModal