
import { Request } from "express"

export enum UserRole{
    Teacher = 'teacher',
    Institute = 'institute',
    SuperAdmin = 'super-admin',
    Student = 'student'
}
export interface AuthRequest extends Request{
    user?: {
        username : string,
        id : string,
        email : string | null,
        role : UserRole,
        currentInstituteNumber : string | null
    },
    file?: Express.Multer.File
    

}
