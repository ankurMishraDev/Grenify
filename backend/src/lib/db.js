import mongoose from 'mongoose';


const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`Error in connecting to MongoDB: ${error.message}`);
        process.exit(1);// means failure    
    }
}

export default connectDB;