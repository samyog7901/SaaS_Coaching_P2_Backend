import { QueryTypes } from "sequelize";
import sequelize from "../../../../database/connection";
import { AuthRequest } from "../../../../middleware/type";
import { Response } from "express";




class TeacherChapterController{
    static async addChapterToCourse(req:AuthRequest,res:Response){
        const {courseId} = req.params
        const instituteNumber = req.user!.currentInstituteNumber
        const {chapterName, chapterDuration, chapterLevel} = req.body
        if(!chapterName || !chapterDuration || !chapterLevel){
            return res.status(400).json({
                message : "please provide all fields."
            })
        }

        //check if course exists or not
        const [course] = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id=?`,{
        replacements : [courseId],
        type : QueryTypes.SELECT
        })

        if(!course){
            return res.status(404).json({
                message : "No course found!"
            })
        }

        const [courseChapter] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE chapterName=? AND courseId=?`,{
            replacements : [chapterName, courseId],
            type : QueryTypes.SELECT
        })
        if(courseChapter){
            return res.status(400).json({
                message : "Already exists with that chapterName in that course."
            })
        }
        // add chapter data to chapter table
        const data = await sequelize.query(`INSERT INTO course_chapter_${instituteNumber}(chapterName,chapterLevel,chapterDuration,courseId) VALUES (?,?,?,?)`,{
            replacements : [chapterName,chapterLevel,chapterDuration,courseId],
            type : QueryTypes.INSERT
        })
        res.status(201).json({
            message : "Chapter added successfully"
        })

    }
    static async fetchCourseChapters(req:AuthRequest,res:Response){
        const {courseId} = req.params
        const instituteNumber = req.user!.currentInstituteNumber
        // const {chapterName, chapterDuration, chapterLevel} = req.body
        if(!courseId){
            return res.status(400).json({
                message : "please provide courseId"
            })
        }

        //check if course exists or not
        const [data] = await sequelize.query(`SELECT * FROM course_chapter_${instituteNumber} WHERE courseId=?`,{
        replacements : [courseId],
        type : QueryTypes.SELECT
        })

        if(data){
            return res.status(200).json({
                message : "chapters fetched",
                data
            })
        }else{
            res.status(404).json({
                message : "chapters not found",
                data : []
            })
        }
       
    }
}
export default TeacherChapterController