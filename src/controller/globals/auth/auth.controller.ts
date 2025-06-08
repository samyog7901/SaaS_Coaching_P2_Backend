import {Request,Response} from "express"
import User from "../../../database/models/user.model"
import bcrypt from "bcrypt"

class AuthController{

    public static async registerUser(req:Request,res:Response):Promise<void>{
        if(req.body == undefined){
            console.log("wrong")
            res.status(400).json({message:"Invalid request"})
        }
        const {username,email,password} = req.body
        if(!username || !email || !password){
            res.status(400).json({
                message:"Please fill all the fields"
            })
            return
        }
        await User.create({
            username,
            email,
            password : bcrypt.hashSync(password,12)
        })
        res.status(201).json({
            message:"User registered successfully"
        })
    }
    async loginUser(){}
}

export default AuthController