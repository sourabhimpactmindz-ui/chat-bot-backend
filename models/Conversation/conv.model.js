import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        title : {
            type : "String",
            default : "New-Chat"
        },
        clientId : {
            type : "string",
            // required : true
        }
    },{timestamps : true}

)

export const Conversation = mongoose.model("Conversation",conversationSchema)