import express from 'express'
const app = express()
app.use(express.urlencoded({ extended: true }))


import authRoute from "../src/routes/globals/auth.route"
import instituteRoute from "../src/routes/institute/instituteRoute"
import courseRoute from "../src/routes/institute/course/courseRoute"
import studentRoute from "../src/routes/institute/student/studentRoute"
import categoryRoute from "./routes/institute/category/categoryRoute"
import teacherInstituteRoute from "./routes/institute/teacher/teacherRoute"
import teacherRoute from "./routes/teacher/teacherRoute"



// Institute Routes
app.use("/api/institute/course",courseRoute)
app.use("/api/institute/teacher",teacherInstituteRoute)
app.use(express.json())

app.use("/api",authRoute) // Global Auth Route
app.use("/api/institute",instituteRoute)

app.use("/api/institute/student",studentRoute)
app.use("/api/institute/category",categoryRoute)

// Teacher Routes
app.use("/api/teacher",teacherRoute)



export default app