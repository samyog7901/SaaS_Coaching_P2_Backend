import express from 'express'
import authRoute from "../src/routes/globals/auth.route"
import instituteRoute from "../src/routes/institute/instituteRoute"
import courseRoute from "../src/routes/institute/course/courseRoute"
import studentRoute from "../src/routes/institute/student/studentRoute"
const app = express()
app.use(express.json())





app.use("/api",authRoute)
app.use("/api/institute",instituteRoute)
app.use("/api/institute/course",courseRoute)
app.use("/api/institute/student",studentRoute)
export default app