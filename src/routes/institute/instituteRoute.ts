






import express,{ Router } from "express"
import InstituteController from "../../controller/institute/instituteController"
import middleware from "../../middleware/middleware"
import asyncErrorHandler from "../../services/asyncErrorHandler"

const router:Router = express.Router()


router.route("/").post(middleware.isLoggedIn,asyncErrorHandler(InstituteController.createInstitute),
    InstituteController.createTeacherTable,InstituteController.createStudentTable,
    asyncErrorHandler(InstituteController.createCourseTable))


export default router