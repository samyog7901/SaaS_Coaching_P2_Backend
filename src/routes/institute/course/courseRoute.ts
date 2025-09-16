






import express,{ Router } from "express"
import middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import CourseController from "../../../controller/institute/course/courseController"
// import {multer,storage} from "../../../middleware/multerConfig"
import upload from "../../../middleware/multerUpload"
import { UserRole } from "../../../middleware/type"
// const upload = multer({storage:storage})

const router:Router = express.Router()
// fieldname inside single()-->represents in which name the file is coming from FE/postman
router.route("/")
.post(middleware.isLoggedIn, middleware.restrictTo(UserRole.Institute), upload.single('courseThumbnail'),asyncErrorHandler(CourseController.createCourse))
.get(middleware.isLoggedIn,asyncErrorHandler(CourseController.getAllCourse))

router.route("/:id")
.get(middleware.isLoggedIn,asyncErrorHandler(CourseController.getSingleCourse))
.delete(middleware.isLoggedIn, middleware.restrictTo(UserRole.Institute), asyncErrorHandler(CourseController.deleteCourse))



export default router