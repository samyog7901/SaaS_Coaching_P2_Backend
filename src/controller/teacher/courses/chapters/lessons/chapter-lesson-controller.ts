import { Response } from "express";
import { AuthRequest } from "../../../../../middleware/type";
import sequelize from "../../../../../database/connection";
import { QueryTypes } from "sequelize";

class ChapterLessonController{
    static async createChapterLesson(req:AuthRequest,res:Response){
        const instituteNumber = req.user!.currentInstituteNumber
        const {lessonName, lessonDescription, lessonVideoUrl, lessonThumbnail, chapterId} = req.body
        if(!lessonName || !lessonDescription || !lessonVideoUrl || !lessonThumbnail || !chapterId ){
            res.status(400).json({message:"Please fill all the fields"})
        }
        await sequelize.query(`INSERT INTO chapter_lesson_${instituteNumber}(lessonName,lessonDescription,lessonVideoUrl,lessonThumbnail,chapterId) VALUES (?,?,?,?,?)`,{
            replacements : [lessonName, lessonDescription,lessonVideoUrl,lessonThumbnail,chapterId],
            type : QueryTypes.INSERT
        })
        res.status(201).json({message : "lesson added to chapter"})
    }

    static async fetchChapterLesson(req:AuthRequest,res:Response){
        const instituteNumber = req.user!.currentInstituteNumber
        const {chapterId} = req.params
        if(!chapterId ){
            res.status(400).json({message:"Please provide chapterId"})
        }
        const data = await sequelize.query(`SELECT * FROM chapter_lesson_${instituteNumber} WHERE chapterId=?`,{
            replacements : [chapterId],
            type : QueryTypes.SELECT
        })
        res.status(200).json({message : "chapter lessons fetched ", data})
    }
}
export default ChapterLessonController