






import express,{ Router } from "express"
import InstituteController from "../../controller/institute/instituteController"
import middleware from "../../middleware/middleware"
import asyncErrorHandler from "../../services/asyncErrorHandler"
import {storage, multer} from '../../middleware/multerConfig'

const upload = multer({storage:storage})
const router:Router = express.Router()

// upload.single('institutePhoto'),
router.route("/").post(middleware.isLoggedIn,asyncErrorHandler(InstituteController.createInstitute),
    InstituteController.createTeacherTable,InstituteController.createStudentTable,InstituteController.createCategoryTable,
    asyncErrorHandler(InstituteController.createCourseTable))


export default router