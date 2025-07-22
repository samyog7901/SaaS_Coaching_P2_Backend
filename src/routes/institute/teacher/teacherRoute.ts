
import express, { Router } from "express"
import middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import TeacherController from "../../../controller/institute/teacher/teacherController"
import upload from "../../../middleware/multerUpload"
const router:Router = express.Router()

router.route("/")
.post(middleware.isLoggedIn,upload.single('teacherPhoto'),asyncErrorHandler(TeacherController.createTeacher))
.get(middleware.isLoggedIn,asyncErrorHandler(TeacherController.getTeachers))

router.route("/:id")
.delete(middleware.isLoggedIn,asyncErrorHandler(TeacherController.deleteTeacher))

export default router