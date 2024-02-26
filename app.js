const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const docRouter = require("./routes/doctorRoutes");
const patRouter = require("./routes/patientRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const profileRouter = require("./routes/profileRoutes");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(express.json({ limit: "1mb", extended: true }));

app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/doctor", docRouter);
app.use("/api/v1/patient", patRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/profile", profileRouter);

app.get("/api/v1/getRazorpayKeys", (req, res) =>
  res.status(200).json({
    key: process.env.RAZORPAY_KEY,
    secret: process.env.RAZORPAY_SECRET,
  })
);

module.exports = app;
