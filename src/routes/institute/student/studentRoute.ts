

import express,{ Router } from "express"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import StudentController from "../../../controller/institute/student/studentController"




const router:Router = express.Router()

router.route("/")
.get(asyncErrorHandler(StudentController.getStudents))


export default router