import { Request, Response } from "express"
import sequelize from "../../../database/connection"
import { AuthRequest } from "../../../middleware/type";
import { QueryTypes } from "sequelize";





class CourseController{
    static async createCourse (req: AuthRequest, res: Response){

        const instituteNumber = req.user?.currentInstituteNumber
        const { courseName, courseDescription, courseDuration, coursePrice,courseLevel, categoryId} = req.body
        
        if(!courseName || !courseDescription || !courseDuration || !coursePrice || !courseLevel || !categoryId){ 
            return res.status(400).json({ message: "All fields are required" })
        }
        const courseThumbnail = req.file ? req.file?.path : null
        console.log("file from multer:", req.file);

        const returnedData = await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName,courseDescription,courseDuration,coursePrice,courseLevel,courseThumbnail,categoryId) VALUES (?,?,?,?,?,?,?)`, {
            replacements: [courseName, courseDescription, courseDuration, coursePrice, courseLevel,courseThumbnail,categoryId]
        })
        console.log(returnedData)
        res.status(200).json({
            message : "Course created successfully"
           
        })
    }

    static async deleteCourse (req: AuthRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const [courseData] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId]
        })
        if (courseData.length === 0) {
            return res.status(404).json({ message: "Course not found with this ID" + courseId });
        }
        await sequelize.query(`DELETE FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId]
        })
        return res.status(200).json({ message: "Course deleted successfully" });
    }

    static async getAllCourse(req:AuthRequest,res:Response){
        const instituteNumber = req.user?.currentInstituteNumber
        const courses = await sequelize.query(`SELECT * FROM course_${instituteNumber} JOIN category_${instituteNumber} ON course_${instituteNumber}.categoryId = category_${instituteNumber}.id`,{
            type : QueryTypes.SELECT
        })
        return res.status(200).json({
            message: "Courses fetched successfully",
            data : courses 
        })
    }

    static async getSingleCourse (req:AuthRequest,res:Response){
        const instituteNumber = req.user?.currentInstituteNumber
        const courseId = req.params.id
        const course = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
            replacements: [courseId]
        })
        if (course[0].length === 0) {
            return res.status(404).json({ message: "Course not found with this ID" + courseId })
        }
        return res.status(200).json({
            message: "Course fetched successfully",
            data: course
        })

    }
    
   


    
}

export default CourseController