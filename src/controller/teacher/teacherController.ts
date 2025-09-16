import { Response } from "express";
import { AuthRequest } from "../../middleware/type";
import sequelize from "../../database/connection";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt"
import generateJwtToken from "../../services/generateJwtToken";

interface ITeacherData{
    teacherPassword : string,
    id: string
}

class TeacherController{
    static async teacherLogin (req: AuthRequest, res: Response) {
        const {teacherEmail, teacherPassword, teacherInstituteNumber} = req.body
        if(!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
            return res.status(400).json({
                message: "Please provide teacherEmail, teacherPassword and teacherInstituteNumber" 
            })
        }


        const teacherData: ITeacherData[] = await sequelize.query(`SELECT * FROM teacher_${teacherInstituteNumber}
            WHERE teacherEmail = ? `,{
                type : QueryTypes.SELECT,
                replacements : [teacherEmail]
            })
        if(teacherData.length === 0) {
            return res.status(404).json({
                message: "Teacher not found / Invalid credentials"
            })
        }
        // check password
        const isPasswordMatched = bcrypt.compareSync(teacherPassword,teacherData[0].teacherPassword)
        if(!isPasswordMatched) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }else{
            //token generation
            const token = generateJwtToken({id: teacherData[0].id, instituteNumber : teacherInstituteNumber})
            res.status(201).json({
                message: "Teacher logged in successfully",
                data : {
                    teacherToken : token,
                    teacherInstituteNumber,
                    teacherEmail
                }
            })
        }
    }
}

export default TeacherController