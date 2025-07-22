
import { Request } from "express"


export interface AuthRequest extends Request{
    user?: {
        username : string,
        id : string,
        email : string | null,
        role : string,
        currentInstituteNumber ?: number | string | null
    },
    file?: Express.Multer.File
    

}
