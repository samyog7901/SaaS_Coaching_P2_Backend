


import express, {Router} from "express"
import asyncErrorHandler from "../../../../services/asyncErrorHandler"
import TeacherChapterController from "../../../../controller/teacher/courses/chapters/chapter-controller"
import middleware from "../../../../middleware/middleware"
import { UserRole } from "../../../../middleware/type"


const router:Router = express.Router()

router.route("/:courseId/chapters")
.post(middleware.isLoggedIn, middleware.restrictTo(UserRole.Teacher), asyncErrorHandler(TeacherChapterController.addChapterToCourse))
.get(middleware.isLoggedIn, middleware.restrictTo(UserRole.Teacher), asyncErrorHandler(TeacherChapterController.fetchCourseChapters))

export default router