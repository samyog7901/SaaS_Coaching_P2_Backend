import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model";
import { AuthRequest, UserRole } from "./type";

class Middleware {
    async isLoggedIn(req: AuthRequest, res: Response, next: NextFunction):Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ message: "Unauthorized - No valid token provided" });
                return
            }

            const token = authHeader.split(" ")[1];

            // Verify token synchronously
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

            const userData = await User.findByPk(decoded.id, {
                attributes: ["id", "username", "email", "role", "currentInstituteNumber"]
            });

            if (!userData) {
                res.status(403).json({ message: "No user with that id" });
                return
            }

            req.user = userData.toJSON();
            next();
        } catch (err) {
             res.status(403).json({ message: "Invalid token" });
        }
    }
    restrictTo(...roles:UserRole[]){
        return (req:AuthRequest,res:Response,next:NextFunction)=>{
            // matching role of requesting user to the parameter role
            let userRole = req.user!.role
            if(roles.includes(userRole)){
                next()
            }else{
                res.status(403).json({
                    message :"Invalid, you don't have access to this"
                })
            }

        }
    }
}

export default new Middleware();
