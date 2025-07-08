import RoomModal from "../model/RoomModal.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 4);

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
    const newRoom = new RoomModal({
      roomCode,
      host: userName,
      players: [
        {
          userName,
          socketId: req.body.socketId,
        },
      ],
    });

    await newRoom.save();
    res.json({
      success: true,
      roomCode,
    });
  } catch (error) {
    console.error(error);
  }
};

export const joinRoom = async (req, res) => {
  const userName = req.user.name;
  const { roomCode, socketId } = req.body;
  const room = await RoomModal.findOne({ roomCode });

  if (!room) {
    return res.status(404).json({ msg: "Room not found" });
  }
  room.players.push({
    userName,
    socketId,
  });
  await room.save();
  res.json({
    success:true,
    message:"Joined Room Successfully"
  })
};
