const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.post("/bookAppointment", appointmentController.bookAppointment);

module.exports = router;
