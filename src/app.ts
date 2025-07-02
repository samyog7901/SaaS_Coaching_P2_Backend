import express from 'express'
import authRoute from "../src/routes/globals/auth.route"
import instituteRoute from "../src/routes/institute/instituteRoute"
const app = express()
app.use(express.json())



app.use("/api",authRoute)
app.use("/api/institute",instituteRoute)
export default app