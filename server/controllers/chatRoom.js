import ChatRoom from "../models/ChatRoom.js";

export const createChatRoom = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Return existing room if one already exists between these two users
    const existing = await ChatRoom.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const newChatRoom = new ChatRoom({ members: [senderId, receiverId] });
    await newChatRoom.save();
    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoomOfUser = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatRoomOfUsers = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.find({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};