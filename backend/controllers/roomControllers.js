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
      roomName: userName + "'s Room",
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
  console.log(room);

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
  res.json({ active: room.isActive });
};
