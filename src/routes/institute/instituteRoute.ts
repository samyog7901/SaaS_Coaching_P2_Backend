






import express,{ Router } from "express"
import InstituteController from "../../controller/institute/instituteController"
import middleware from "../../middleware/middleware"

const router:Router = express.Router()


router.route("/").post(middleware.isLoggedIn,InstituteController.createInstitute,InstituteController.createTeacherTable,InstituteController.createStudentTable,InstituteController.createCourseTable)


export default router