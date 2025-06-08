import express from 'express'
import authRoute from "../src/routes/globals/auth.route"
const app = express()



app.use(express.json())
app.use("/api",authRoute)
export default app