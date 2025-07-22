






import express,{ Router } from "express"
import middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import CourseController from "../../../controller/institute/course/courseController"
// import {multer,storage} from "../../../middleware/multerConfig"
import upload from "../../../middleware/multerUpload"
// const upload = multer({storage:storage})

const router:Router = express.Router()
// fieldname inside single()-->represents in which name the file is coming from FE/postman
router.route("/")
.post(middleware.isLoggedIn,upload.single('courseThumbnail'),asyncErrorHandler(CourseController.createCourse))
.get(middleware.isLoggedIn,asyncErrorHandler(CourseController.getAllCourse))

router.route("/:id")
.get(asyncErrorHandler(CourseController.getSingleCourse))
.delete(asyncErrorHandler(CourseController.deleteCourse))



export default router