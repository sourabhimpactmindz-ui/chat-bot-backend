import app from "./app.js";
import { dbconfig } from "./config/db.js";

const PORT = process.env.PORT || 3000;

const server = async() => {
    await dbconfig()
    app.listen(PORT , () => {
    console.log("server is running")
})
}

server()