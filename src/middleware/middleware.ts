import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../database/models/user.model"
import { AuthRequest } from "./type"



class Middleware{
    async isLoggedIn(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        // check if logged in or not
        // accept token(req.headers-->secure)
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({
                message : "Unauthorized - No Valid token provided"

            })
            return
        }
        // verify token
        const token = authHeader.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRET!,async(err,decoded:any)=>{
            if(err){
                res.status(403).json({
                    message : "INVALID TOKEN"
                })
                return
            }else{
                const  userData = await User.findByPk(decoded.id,{
                    attributes: ['id', 'username', 'email', 'role', 'currentInstituteNumber']
                })
                if(!userData){
                    res.status(403).json({
                        message : "No user with that id"

                    })
                }else{
                    req.user = userData
                    next()

                }
                
            }

        })
       


    }
}

export default new  Middleware() // export middleware class