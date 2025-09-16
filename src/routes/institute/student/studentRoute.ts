

import express,{ Router } from "express"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import StudentController from "../../../controller/institute/student/studentController"
import middleware from "../../../middleware/middleware"
import upload from "../../../middleware/multerUpload"




const router:Router = express.Router()

router.route("/")
.post(middleware.isLoggedIn,upload.single('studentImage'),asyncErrorHandler(StudentController.createStudent))
.get(middleware.isLoggedIn,asyncErrorHandler(StudentController.getStudents))

router.route("/:id")
.delete(middleware.isLoggedIn, asyncErrorHandler(StudentController.deleteStudent))


export default router