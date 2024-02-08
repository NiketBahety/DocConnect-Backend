const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const docRouter = require("./routes/doctorRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");

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
app.use("/api/v1/appointment", appointmentRouter);

module.exports = app;
