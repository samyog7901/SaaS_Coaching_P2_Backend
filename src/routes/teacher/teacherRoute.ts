

import express, {Router} from "express"
import asyncErrorHandler from "../../services/asyncErrorHandler"
import TeacherController from "../../controller/teacher/teacherController"

const router:Router = express.Router()

router.route("/").post(asyncErrorHandler(TeacherController.teacherLogin))

export default router