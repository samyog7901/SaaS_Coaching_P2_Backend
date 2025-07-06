import { Response } from "express";
import sequelize from "../../../database/connection";
import { AuthRequest } from "../../../middleware/type";




class StudentController{
    static async getStudents (req: AuthRequest, res: Response){

        const instituteNumber = req.user?.currentInstituteNumber
        const students = await sequelize.query(`SELELCT * FROM student_${instituteNumber}`)
        res.status(200).json({
            message: "Students fetched successfully",
            data : students 
        })
       
    }
}

export default StudentController