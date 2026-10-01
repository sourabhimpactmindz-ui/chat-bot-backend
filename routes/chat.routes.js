
import express from 'express'
import rateLimit from 'express-rate-limit'
import { ConversationHistory, ConverstaionMessage, DeleteConversation, sendChatMessage } from '../controllers/chat.controller.js'
import { requireClientId } from '../middleware/requireClientId.js';

const chat = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
chat.use(requireClientId);
chat.post("/",limiter,sendChatMessage)
chat.get("/",ConversationHistory)
chat.get("/:id",ConverstaionMessage)
chat.delete("/:id",DeleteConversation)

export default chat;