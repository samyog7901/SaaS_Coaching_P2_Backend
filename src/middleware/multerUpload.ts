


import multer from 'multer'
import {cloudinary,storage} from '../services/cloudinaryConfig'
import { Request } from 'express'
const upload = multer({storage :storage,
    fileFilter : (req:Request,file:Express.Multer.File,cb:any)=>{
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if(allowedFileTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false)
        }
    },
    limits : {
        fileSize: 1024 * 1024 * 2 // 2MB
    }
})

export default upload