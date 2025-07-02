
import { Request } from "express"


export interface AuthRequest extends Request{
    user?: {
        username : string,
        id : string,
        email : string | null,
        role : string
    },
    instituteNumber ?: number | string

}
