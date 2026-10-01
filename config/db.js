import dns from 'dns'

dns.setServers(["1.1.1.1"])
import mongoose from "mongoose"
import "dotenv/config"
export const dbconfig = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database is connected")
    }catch(err){
        console.log("database error",err)
    }
}
