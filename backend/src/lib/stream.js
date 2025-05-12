import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    throw new Error('STREAM_API_KEY or STREAM_API_SECRET is missing');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) =>{
    try{
        await streamClient.upsertUser(userData);
        return userData;
    } catch(error){
        console.log("Error in upsertStreamUser", error.message);
        throw new Error("Error in upsertStreamUser");
    }
}

export const getStreamToken = (userId) => {}
    