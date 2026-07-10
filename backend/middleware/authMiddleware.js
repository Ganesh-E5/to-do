import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req,res,next) =>{
    try {
        const authHeader = req.headers.authorization;
        
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Not authorized, no token provided"});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({message : "Not authorized, user no longer exists"})
        }

         if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before accessing this resource" });
        }

        req.user = user;

        next()
    } catch (error) {
        return res.status(401).json({message: "Not authorized, invalid or expired token"})
    }
}