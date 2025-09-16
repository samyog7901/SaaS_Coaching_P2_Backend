import { Response } from "express";
import sequelize from "../../../database/connection";
import { AuthRequest } from "../../../middleware/type";
import { QueryTypes } from "sequelize";




class StudentController{
    static async createStudent (req :AuthRequest, res: Response){
        const instituteNumber = req.user!.currentInstituteNumber
        const {studentName, studentEmail, studentPhoneNumber, studentAddress,enrolledDate} = req.body
        if(!studentName || !studentEmail || !studentPhoneNumber || !studentAddress || !enrolledDate){
            return res.status(400).json({message:"All fields are required"})
        }
        const studentImage = req.file ? req.file.path : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxR6Owe3AOpaleqNTELMgJKg9MNySuuHjQ_Q&s"

        await sequelize.query(`INSERT INTO student_${instituteNumber}(studentName, studentEmail, studentPhoneNumber, studentAddress,enrolledDate,studentImage) VALUES (?,?,?,?,?,?)`,{
            replacements : [studentName, studentEmail, studentPhoneNumber, studentAddress, enrolledDate, studentImage],
            type : QueryTypes.INSERT
        })
        res.status(201).json({message:"student created successfully"})
    }

    

    static async getStudents (req: AuthRequest, res: Response){

        const instituteNumber = req.user!.currentInstituteNumber

        const students = await sequelize.query(`SELECT * FROM student_${instituteNumber}`,{
            type : QueryTypes.SELECT
        })
        res.status(200).json({
            message: "Students fetched successfully",
            data : students 
        })
       
    }

    static async deleteStudent (req: AuthRequest, res: Response) {
        const instituteNumber = req.user!.currentInstituteNumber
        const id = req.params.id
        await sequelize.query(`DELETE FROM student_${instituteNumber} WHERE id = ?`, {
            replacements: [id],
            type : QueryTypes.DELETE
        })
        res.status(200).json({
            message: "Student deleted successfully"
        })
    }


}

export default StudentController