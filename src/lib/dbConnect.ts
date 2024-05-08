
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection:ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected DB");
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || " ");
        connection.isConnected = db.connections[0].readyState
        console.log("DB connection established");
    }
    catch(error){
        console.log("Connection Failed: ",error);
        process.exit(1);
    }
}


export default dbConnect;