import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt_token;
        if(!token){
            return res.status(401).json({message: "Unauthorized, token not found"});
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        if(!decode){
            return res.status(401).json({message: "Unauthorized, token not valid"});
        }
        const user = await User.findById(decode.userId).select('-password');
        if(!user){
            return res.status(401).json({message: "Unauthorized, user not found"});
        }
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message: 'Internal server error'});
    }
}