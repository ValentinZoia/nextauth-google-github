import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string || "mongodb://127.0.0.1:27017/next-auth-gg";

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

const connectDB = async ()=> {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected ✨");
    }catch(error: any){
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;