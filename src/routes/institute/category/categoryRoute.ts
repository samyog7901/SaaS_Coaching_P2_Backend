


import express,{ Router } from "express"
import asyncErrorHandler from "../../../services/asyncErrorHandler"
import CategoryController from "../../../controller/institute/category/categoryController"
import middleware from "../../../middleware/middleware"



const router:Router = express.Router()

router.route('/')
.post(middleware.isLoggedIn,asyncErrorHandler(CategoryController.createCategory))
.get(middleware.isLoggedIn,asyncErrorHandler(CategoryController.getCategories))

router.route('/:id')
.delete(middleware.isLoggedIn,asyncErrorHandler(CategoryController.deleteCategory))


export default router