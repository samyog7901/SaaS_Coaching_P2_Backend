import express from 'express';
import cors from 'cors';

import authRoute from "../src/routes/globals/auth.route";
import instituteRoute from "../src/routes/institute/instituteRoute";
import courseRoute from "../src/routes/institute/course/courseRoute";
import studentRoute from "../src/routes/institute/student/studentRoute";
import categoryRoute from "./routes/institute/category/categoryRoute";
import teacherInstituteRoute from "./routes/institute/teacher/teacherRoute";
import teacherRoute from "./routes/teacher/teacherRoute";

const app = express();



// 2️⃣ Parse incoming requests
app.use(express.json()); // For application/json
// 1️⃣ CORS
app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.urlencoded({ extended: true })); // For form data

// 3️⃣ Routes
app.use("/api/auth", authRoute); // Global Auth Route

// Institute Routes
app.use("/api/institute/course", courseRoute);
app.use("/api/institute/teacher", teacherInstituteRoute);
app.use("/api/institute", instituteRoute);
app.use("/api/institute/student", studentRoute);
app.use("/api/institute/category", categoryRoute);

// Teacher Routes
app.use("/api/teacher", teacherRoute);

export default app;
