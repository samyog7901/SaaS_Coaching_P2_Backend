
// higher order funcn--> takes another function as an argument
// and returns a new function that handles errors
// callback function is a function passed as an argument to another function

import { NextFunction, Request, Response } from "express"



// and is executed after the first function completes


const asyncErrorHandler = (fn:Function)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        fn(req,res,next).catch((err:Error)=>{
            console.log(err, "ERROR")
            return res.status(500).json({
                message : err.message, 
                fullError : err
            })
        })
    }
}
export default asyncErrorHandler