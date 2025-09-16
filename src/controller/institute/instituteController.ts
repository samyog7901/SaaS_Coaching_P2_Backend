import { NextFunction, Response } from "express"
import sequelize from "../../database/connection"
import generateRandomInstNumber from "../../services/generateRandomInstNumber"
import { AuthRequest } from "../../middleware/type"
import User from "../../database/models/user.model"
import categories from "../../seed"
import { QueryTypes } from "sequelize"

class InstituteController {
  static async createInstitute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { instituteName, instituteEmail, institutePhoneNumber, instituteAddress } = req.body
      const instituteVatNo = req.body.instituteVatNo || null
      const institutePanNo = req.body.institutePanNo || null

      if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
        return res.status(400).json({ message: "Please fill all the fields" })
      }

      const instituteNumber = generateRandomInstNumber()

      // Create institute table
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

      // Insert institute record
      await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,instituteVatNo,institutePanNo) VALUES(?,?,?,?,?,?)`, {
        replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, instituteVatNo, institutePanNo],
        type : QueryTypes.INSERT
      })

      // User-institute mapping table
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        userId VARCHAR(255) REFERENCES users(id),
        instituteNumber INT UNIQUE
      )`)

      if (req.user) {
        await sequelize.query(`INSERT INTO user_institute(userId,instituteNumber) VALUES(?,?)`, {
          replacements: [req.user.id, instituteNumber],
          type : QueryTypes.INSERT
        })

        await User.update({
          currentInstituteNumber: instituteNumber.toString(),
          role: "institute"
        }, {
          where: { id: req.user.id }
        })

        req.user.currentInstituteNumber = instituteNumber.toString()
      }

      next()
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }

  static async createTeacherTable(req: AuthRequest, res: Response, next: NextFunction):Promise<void> {
    const instituteNumber = req.user!.currentInstituteNumber
    if (!instituteNumber) res.status(400).json({ message: "Institute number missing" })

    await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      teacherName VARCHAR(255) NOT NULL,
      teacherEmail VARCHAR(255) NOT NULL,
      teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      teacherExperience VARCHAR(255),
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

  // teacher-chapter
  static async createCourseChapterTable(req:AuthRequest,res:Response,next:NextFunction){
    const instituteNumber = req.user!.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS course_chapter_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      chapterName VARCHAR(255) NOT NULL,
      chapterDuration VARCHAR(100) NOT NULL,
      chapterLevel ENUM('beginner','intermediate','advance') NOT NULL,
      courseId VARCHAR(36) REFERENCES course_${instituteNumber}(id) ON DELETE CASCADE ON UPDATE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    next()
  }

  static async createStudentTable(req: AuthRequest, res: Response, next: NextFunction):Promise<void> {
    const instituteNumber = req.user!.currentInstituteNumber
    if (!instituteNumber)  res.status(400).json({ message: "Institute number missing" })

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

  static async createCourseTable(req: AuthRequest, res: Response) {
    const instituteNumber = req.user!.currentInstituteNumber
    if (!instituteNumber)  res.status(400).json({ message: "Institute number missing" })

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
      message: "Institute created successfully",
      instituteNumber
    })
  }

  static async createCategoryTable(req: AuthRequest, res: Response, next: NextFunction):Promise<void> {
    const instituteNumber = req.user!.currentInstituteNumber
    if (!instituteNumber)  res.status(400).json({ message: "Institute number missing" })

    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      categoryName VARCHAR(255) NOT NULL,
      categoryDescription TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

    for (const category of categories) {
      await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES(?,?)`, {
        replacements: [category.categoryName, category.categoryDescription],
        type: QueryTypes.INSERT
      })
    }

    next()
  }

  static async createChapterLessonTable(req:AuthRequest,res:Response,next:NextFunction):Promise<void>{
    const instituteNumber = req.user!.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS chapter_lesson_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      lessonName VARCHAR(255) NOT NULL,
      lessonDescription TEXT,
      lessonVideoUrl VARCHAR(200) NOT NULL,
      lessonThumbnail VARCHAR(200) NOT NULL,
      chapterId VARCHAR(36) REFERENCES course_chapter_${instituteNumber}(ID) ON DELETE CASCADE ON UPDATE CASCADE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    next()
  }



  static async getInstitute (req: AuthRequest, res: Response, next: NextFunction):Promise<void>{
    const instituteNumber = req.user!.currentInstituteNumber
    const institute = await sequelize.query(`SELECT * FROM institute_${instituteNumber}`, {
        type : QueryTypes.SELECT
    })
    res.status(200).json({
        message: "Institute fetched successfully",
        data : institute
    })
}
}

export default InstituteController
