import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../database/models/user.model"
import { AuthRequest } from "./type"



class Middleware{
    async isLoggedIn(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
        // check if logged in or not
        // accept token(req.headers-->secure)
        const token = req.headers.authorization
        if(!token || token === undefined){
            res.status(401).json({
                message : "Unauthorized"

            })
            return
        }
        // verify token
        jwt.verify(token,process.env.SECRET_KEY as string,async(err,decoded:any)=>{
            if(err){
                res.status(403).json({
                    message : "Forbidden"
                })
                return
            }else{
                const  userData = await User.findByPk(decoded.id)
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