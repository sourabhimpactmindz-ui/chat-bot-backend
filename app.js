import express from 'express';
import dotenv from "dotenv" 
import cors from 'cors'
import chat from './routes/chat.routes.js';
const app = express();

app.use(express.json())
app.set("trust proxy",1)

app.use(
    cors({
        origin:process.env.FRONT_URL,
        allowedHeaders:["content-type","x-client-id"]
    })
);

app.get("/",(req,res) => {
    res.json({success:true , response:"server is running"})
})

app.use("/api",chat)

export default app;