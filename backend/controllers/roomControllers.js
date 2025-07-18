import RoomModal from "../model/RoomModal.js";
import words from "../utils/Words.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 4);
const num = customAlphabet("1234567890", 1);

export const createRoom = async (req, res) => {
  try {
    const userName = req.user.name;
    if (!userName) {
      res.json({
        success: false,
        Message: "User Not Found",
      });
    }
    const roomCode = nanoid();
    const index = parseInt(num());
    const newRoom = new RoomModal({
      roomCode,
      host: userName,
      roomName: userName + "'s Room",
      players: [
        {
          userName,
          socketId: req.body.socketId,
        }
      ],
      guessingWord: words[index],
    });

    await newRoom.save();
    res.json({
      success: true,
      roomCode,
      roomName: newRoom.roomName,
      guessingWord: newRoom.guessingWord,
      message: "Room Created Successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

export const joinRoom = async (req, res) => {
  const userName = req.user.name;
  const { roomCode, socketId } = req.body;
  const room = await RoomModal.findOne({ roomCode });
  // console.log(room);

  if (!room || !room.isActive) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }
  if (room.isActive) {
    const playerExists = room.players.some(
      (player) => player.userName === userName
    );
    if (playerExists) {
      return res.json({
        success: true,
        message: "You are already in this room",
      });
    } else {
      room.players.push({
        userName,
        socketId,
      });
      await room.save();
      res.json({
        success: true,
        message: "Joined Room Successfully",
        guessingWord: room.guessingWord,
        roomName: room.roomName,

      });
    } 
  }
  return res.json({
    success: false,
    message: "Room is not active",
  });
};

export const roomActive = async (req, res) => {
  const { roomCode } = req.params;
  const room = await RoomModal.findOne({ roomCode });
  if (!room) return res.json({ active: false });
  res.json({ active: room.isActive, roomName: room.roomName, guessingWord: room.guessingWord });
};

export const addDrawing = async (req, res) => {
  const { roomCode, drawing } = req.body;
  const room = await RoomModal.findOne({ roomCode });
  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }
  room.drawings.push(drawing);
  await room.save();
  res.json({ success: true, message: "Drawing added successfully"});
};

export const addMessages = async (req, res) => {
  const { roomCode, message } = req.body;
  const room = await RoomModal.findOne({ roomCode });
  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }
  room.historyMessages.push(message);
  await room.save();
  res.json({ success: true, message: "Message added successfully"});
};

export const getMessages = async (req,res)=>{
 try {
   const { roomCode } = req.params;

  const  room = await RoomModal.findOne({ roomCode });
  if(!room) return res.json({historyMessages:[]});
  return res.json({success:true ,history:room.historyMessages})
  
  
 } catch (error) {
  console.error("Error fetching message history:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
 }
}

export const getDrawingHistory = async (req, res) => {
  const { roomCode } = req.params;
  const room = await RoomModal.findOne({ roomCode });
  if (!room) return res.json({ history: [] });
  res.json({ success: true, history: room.drawings });
};


export const clearDrawingHistory = async (req, res) => {
  const { roomCode } = req.body;
  const room = await RoomModal.findOne({ roomCode });
  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }
  room.drawings = [];
  await room.save();
  res.json({ success: true, message: "Drawing history cleared" });
};

export const deleteRoom = async (req,res)=>{
  const {roomCode}=req.params;
  const room = await RoomModal.findOne({roomCode});

  if(!room){
    return res.json({success:false,message:"Room not found"});
  }
  await RoomModal.deleteOne({roomCode});
  res.json({success:true,message:"Room  Exited Successfully"}); 
}