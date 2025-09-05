import { Response } from "express";
import { AuthRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import GenerateRandomPassword from "../../../services/generateRandomPassword";
import sendMail from "../../../services/sendEmail";



class TeacherController{
    static async createTeacher (req: AuthRequest,res:Response){
        // teacher ko kk data chaiyeko xa tyo accept garam
        const instituteNumber = req.user?.currentInstituteNumber
        const {teacherName, teacherEmail, teacherPhoneNumber,teacherExperience, teacherSalary, teacherJoinedDate,courseId} = req.body
        const teacherPhoto = req.file ? req.file.path : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxR6Owe3AOpaleqNTELMgJKg9MNySuuHjQ_Q&s"
        if(!teacherName || !teacherEmail  || !teacherPhoneNumber || !teacherExperience || !teacherSalary || !teacherJoinedDate || !courseId){
            return res.status(400).json({ message: "All fields are required" })
        }
        // password generate function
        const data = GenerateRandomPassword.generateRandomPassword(teacherName)
        await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherEmail, teacherPhoneNumber,teacherExperience, teacherSalary, teacherJoinedDate, teacherPhoto, teacherPassword) VALUES (?,?,?,?,?,?,?,?)`, {
            type : QueryTypes.INSERT,
            replacements : [teacherName, teacherEmail, teacherPhoneNumber, teacherExperience, teacherSalary, teacherJoinedDate, teacherPhoto, (await data).hashedVersion]
        })

        const teacherData : {id:string}[] = await sequelize.query(`SELECT id FROM teacher_${instituteNumber} WHERE teacherEmail = ?`, {
            type : QueryTypes.SELECT,
            replacements : [teacherEmail]
        })
        console.log("teacher Data", teacherData)

            await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId = ? WHERE id = ?`,{
                type :QueryTypes.UPDATE,
                replacements : [teacherData[0].id, courseId]
            })

        // send mail function goes here
        const mailInformation = {
            to : teacherEmail,
            subject : "Welcome to our Institute",
            text : `Your account has been created successfully. Your username : ${teacherName} , your
            password : ${(await data).plainVersion} and your institute Number : ${instituteNumber}.`

        }
        try {
            await sendMail(mailInformation)
            console.log("✅ Mail sent to:", teacherEmail)
          } catch (mailError) {
            console.error("❌ Failed to send mail:", mailError)
          }
          res.status(201).json({
            message : "Teacher created successfully"
        })
    }
    static async getTeachers (req: AuthRequest, res: Response){
        const instituteNumber = req.user?.currentInstituteNumber
        const teachers = await sequelize.query(`SELECT * FROM teacher_${instituteNumber}`, {
            type : QueryTypes.SELECT
        })
        res.status(200).json({
            message: "Teachers fetched successfully",
            data : teachers
        })
    }
    static async deleteTeacher (req: AuthRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id = req.params.id
        await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id = ?`, {
            type : QueryTypes.DELETE,
            replacements: [id]
        })
        res.status(200).json({
            message: "Teacher deleted successfully"
        })
    }

}

export default TeacherController