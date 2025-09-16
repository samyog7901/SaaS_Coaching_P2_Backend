import {Request,Response} from "express"
import User from "../../../database/models/user.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import generateJwtToken from "../../../services/generateJwtToken"

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
    static async loginUser(req:Request,res:Response):Promise<void>{
        const {email,password} = req.body
        if(!email || !password){
            res.status(400).json({
                message:"Please provide email, password!"
            })
            return
        }
        const data = await User.findAll({
            where:{
                email
            }
        })
        if(data.length == 0){
            res.status(400).json({
                message:"User not found!"
            })
            
        }else{
            const isPasswordMatch = bcrypt.compareSync(password,data[0].password)
            if(isPasswordMatch){
                const token = generateJwtToken({id:data[0].id,instituteNumber: data[0].currentInstituteNumber})
                console.log("Generated JWT:", token);
                console.log("Payload:", jwt.decode(token));
                res.status(200).json({
                    message:"User logged in successfully!",
                    data : {
                        token,
                        username:data[0].username

                    }
                })
                
            }else{
                res.status(403).json({
                    message:"Invalid email or password!"
                })
            }
        }
    }
      
}

export default AuthController