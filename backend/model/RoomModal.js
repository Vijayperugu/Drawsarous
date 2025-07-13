import mongoose from 'mongoose';
const RoomSchems = new mongoose.Schema({

    roomCode :{
        type:String,
        required:true,
        unique:true
    },
    roomName:{
        type:String,
        default:""
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
        default:""
    },
    historyMessages:{
        type:[Object],
        default:[]
    },
    drawings: {
        type: [Object],
        default: []
    },
    isActive:{
        type:Boolean,
        default:true
    }


})
const RoomModal = mongoose.model('room',RoomSchems);

export default RoomModal