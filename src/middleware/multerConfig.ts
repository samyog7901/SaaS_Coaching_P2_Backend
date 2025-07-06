

import { Request } from 'express'
import multer from 'multer'


// storing files locally
const storage =multer.diskStorage({
    // Define the destination directory for uploaded files
    destination : (req:Request,file:Express.Multer.File,cb:any)=>{
        cb(null,'./src/storage')
    },
    // Define the filename for the uploaded files
    filename : function(req:Request,file:Express.Multer.File,cb:any){
        cb(null,Date.now() + '-' + file.originalname)
    }

})

export {multer, storage}