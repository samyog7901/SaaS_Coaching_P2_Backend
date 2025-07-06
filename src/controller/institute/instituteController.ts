import { NextFunction, Request, Response } from "express"
import sequelize from "../../database/connection"
import generateRandomInstNumber from "../../services/generateRandomInstNumber"
import { AuthRequest } from "../../middleware/type"
import User from "../../database/models/user.model"




class InstituteController{
    static async createInstitute(req:AuthRequest,res:Response,next:NextFunction){
      try{
       

        const {instituteName,instituteEmail,institutePhoneNumber,
        instituteAddress} = req.body
        const instituteVatNo = req.body.instituteVatNo || null
        const institutePanNo = req.body.instituePanNo || null
        if(!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress){
            res.status(400).json({
                message:"Please fill all the fields"
            })
            return
        }
            
        const instituteNumber = generateRandomInstNumber()
         await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${institutePanNo || instituteVatNo || instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR(255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            instituteVatNo VARCHAR(255),
            institutePanNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`) 
        
        await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,instituteVatNo,institutePanNo) VALUES (?,?,?,?,?,?)`,{
            replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNo, institutePanNo]


        })
        // to create user_institute history table
        await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            userId VARCHAR(255) REFERENCES users(id),
            instituteNumber INT UNIQUE   
        )`)

        await sequelize.query(`INSERT INTO user_institute(userId,instituteNumber) VALUES (?,?)`,{
            replacements: [req.user?.id, instituteNumber]
        })

        if(req.user){
            await User.update({
                currentInstituteNumber: instituteNumber
            },{
                where : {
                    id : req.user.id
                }
            })
        }

        next()
      }catch(e){
        console.log(e)
      }
    }
    static async createTeacherTable(req:AuthRequest,res:Response,next:NextFunction){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE ,
            teacherAddress VARCHAR(255) NOT NULL,
            teacherExpertise VARCHAR(255),
            joinedDate DATE,
            salary VARCHAR(100),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
        )`)
        next()
    }

    static async createStudentTable(req:AuthRequest,res:Response,next:NextFunction){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            studentName VARCHAR(255) NOT NULL,
            studentEmail VARCHAR(255) NOT NULL UNIQUE,
            studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            studentAddress TEXT,
            enrolledDate DATE,
            studentImage VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP   
        )`)
        next()
    }

    static async createCourseTable(req:AuthRequest,res:Response){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            courseName VARCHAR(255) NOT NULL,
            courseDescription TEXT,
            courseThumbnail VARCHAR(255),
            coursePrice VARCHAR(255) NOT NULL,
            courseDuration VARCHAR(100) NOT NULL,
            courseLevel ENUM('beginner','intermediate','advance') NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
        

        res.status(200).json({
            message : "Institute created successfully",
            instituteNumber
        })
    

    }




    
}

export default InstituteController