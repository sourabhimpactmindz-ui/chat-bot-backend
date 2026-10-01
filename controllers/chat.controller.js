import mongoose from "mongoose";
import { Conversation } from "../models/Conversation/conv.model.js";
import { Message } from "../models/message/message.model.js";
import { generateAiResponse } from "../services/ai.service.js";

export const sendChatMessage = async (req, res) => {
  try {
    const { message, conversationid } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (message.length > 2000) {
      return res.status(400).json({ success: false, message: "Message too long" });
    }

    let conversation = null;

    if (conversationid && mongoose.isValidObjectId(conversationid)) {
      conversation = await Conversation.findOne({
        _id: conversationid,
        clientId: req.clientId,
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        title: message.substring(0, 40),
        clientId: req.clientId,
      });
    }

    await Message.create({
      conversationid: conversation._id,
      role: "user",
      content: message,
    });

    const messages = await Message.find({ conversationid: conversation._id })
      .sort({ createdAt: 1 })
      .select("role content -_id");

      let aborted = false;
res.on("close", () => {
  if (!res.writableEnded) aborted = true;
});

    const response = await generateAiResponse(messages);

    if (aborted) return;

    await Message.create({
      conversationid: conversation._id,
      role: "assistant",
      content: response,
    });

    res.status(200).json({
      success: true,
      conversationid: conversation._id,
      title:conversation.title,
      response,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const ConversationHistory = async (req, res) => {
  try {
    const getAll = await Conversation.find({ clientId: req.clientId }).sort({ createdAt: 1 });

    // 404 nahi, empty list do: naye user ke liye ye error nahi hai
    return res.status(200).json({ message: "all chat fetched", status: true, getAll });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error", status: false });
  }
};

export const ConverstaionMessage = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "conversation not found", status: false });
    }

    const conversation = await Conversation.findOne({ _id: id, clientId: req.clientId });

    if (!conversation) {
      return res.status(404).json({ message: "conversation not found", status: false });
    }

    const messages = await Message.find({ conversationid: id }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, conversation, messages });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", status: false });
  }
};

export const DeleteConversation = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "conversation not found", status: false });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      clientId: req.clientId,
    });

    if (!conversation) {
      return res.status(404).json({ message: "conversation not found", status: false });
    }

    await Message.deleteMany({ conversationid: id });

    return res.status(200).json({ success: true, status: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error", status: false });
  }
};