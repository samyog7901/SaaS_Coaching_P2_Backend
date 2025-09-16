import { Request, Response } from "express"
import sequelize from "../../../database/connection"
import { QueryTypes } from "sequelize"


class studentInstituteController{
    static async instituteListForStudent(req:Request,res:Response){
        const tables = await sequelize.query(`SHOW TABLES LIKE 'institute_%'`,{
            type : QueryTypes.SHOWTABLES
        })

        let allDatas = []
        for(let table of tables){
            const instituteNumber = table.split("_")[1]
            const [data] = await sequelize.query(`SELECT instituteName,institutePhoneNumber FROM ${table}`,{
                type : QueryTypes.SELECT
            })
            allDatas.push({instituteNumber:instituteNumber,...data},)
        }
        res.status(200).json({message:"data feteched", data:allDatas})
    }

    static async instituteCourseListForStudent(req:Request,res:Response){
       const {instituteId} = req.params
       const datas = await sequelize.query(`SELECT courseName, courseDescription,courseThumbnail,coursePrice,courseLevel,categoryName FROM course_${instituteId} JOIN category_${instituteId} ON course_${instituteId}.categoryId = category_${instituteId}.id`,{
        type : QueryTypes.SELECT
       })
       if(datas.length === 0){
        res.status(404).json({message:"No courses found of that instiute"})
       }else{
        res.status(200).json({message:"Courses fetched",data:datas})
       }
    }
}

export default studentInstituteController