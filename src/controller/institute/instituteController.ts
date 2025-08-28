import { NextFunction, Response } from "express"
import sequelize from "../../database/connection"
import generateRandomInstNumber from "../../services/generateRandomInstNumber"
import { AuthRequest } from "../../middleware/type"
import User from "../../database/models/user.model"
import categories from "../../seed"




class InstituteController{
    static async createInstitute(req:AuthRequest,res:Response,next:NextFunction){
      try{
       

        const {instituteName,instituteEmail,institutePhoneNumber,
        instituteAddress} = req.body
        const instituteVatNo = req.body.instituteVatNo || null
        const institutePanNo = req.body.institutePanNo || null
        if(!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress){
            res.status(400).json({
                message:"Please fill all the fields"
            })
            return
        }
       
            
        const instituteNumber = generateRandomInstNumber()
       

         await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            userId VARCHAR(255) REFERENCES users(id),
            instituteNumber INT UNIQUE   
        )`)

    

        if(req.user){
            await sequelize.query(`INSERT INTO user_institute(userId,instituteNumber) VALUES (?,?)`,{
                replacements: [req.user?.id, instituteNumber]
            })
            await User.update({
                currentInstituteNumber: instituteNumber,
                role: "institute"
            },{
                where : {
                    id : req.user.id
                }
            })
        }

       if(req.user){
        
            req.user.currentInstituteNumber = instituteNumber
       }

        next()
      }catch(e){
        console.log(e)
      }
    }
    static async createTeacherTable(req:AuthRequest,res:Response,next:NextFunction){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
           id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            teacherName VARCHAR(255) NOT NULL,
            teacherEmail VARCHAR(255) NOT NULL UNIQUE,
            teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE ,
            teacherAddress VARCHAR(255) NOT NULL,
            teacherExpertise VARCHAR(255),
            teacherJoinedDate DATE,
            teacherSalary VARCHAR(100),
            teacherPhoto VARCHAR(255),
            teacherPassword VARCHAR(255),
            courseId VARCHAR(36) REFERENCES course_${instituteNumber}(id),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
        )`)
        next()
    }

    static async createStudentTable(req:AuthRequest,res:Response,next:NextFunction){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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

    static async createCourseTable (req:AuthRequest,res:Response){
        const instituteNumber = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            courseName VARCHAR(255) NOT NULL UNIQUE,
            courseDescription TEXT,
            courseThumbnail VARCHAR(200),
            coursePrice VARCHAR(255) NOT NULL,
            courseDuration VARCHAR(100) NOT NULL,
            courseLevel ENUM('beginner','intermediate','advance') NOT NULL,
            teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber}(id),
            categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber}(id),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
        

        res.status(201).json({
            message : "Institute created successfully",
            instituteNumber
        })
    

    }

    static async createCategoryTable (req:AuthRequest,res:Response,next:NextFunction){
        const instituteNumber  = req.user?.currentInstituteNumber
        await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
            id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            categoryName VARCHAR(255) NOT NULL,
            categoryDescription TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
        categories.forEach(async function(category){
            await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES(?,?)`,{
                replacements : [category.categoryName,category.categoryDescription]
            })
        })
        next()
            
    }




    
}

export default InstituteController