






import express,{ Router } from "express"
import middleware from "../../../middleware/middleware"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import CourseController from "../../../controller/institute/course/courseController"


const router:Router = express.Router()

router.route("/")
.post(middleware.isLoggedIn,asyncErrorHandler(CourseController.createCourse))
.get(asyncErrorHandler(CourseController.getAllCourse))

router.route("/:id")
.get(asyncErrorHandler(CourseController.getSingleCourse))
.delete(asyncErrorHandler(CourseController.deleteCourse))



export default router