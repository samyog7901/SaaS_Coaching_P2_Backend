


import express, {Router} from "express"
import ChapterLessonController from "../../../../../controller/teacher/courses/chapters/lessons/chapter-lesson-controller"
import middleware from "../../../../../middleware/middleware"
import { UserRole } from "../../../../../middleware/type"
import asyncErrorHandler from "../../../../../services/asyncErrorHandler"



const router:Router = express.Router()

router.route("/:chapterId/lessons")
.post(middleware.isLoggedIn, middleware.restrictTo(UserRole.Teacher), asyncErrorHandler(ChapterLessonController.createChapterLesson))
.get(middleware.isLoggedIn, asyncErrorHandler(ChapterLessonController.fetchChapterLesson))

export default router